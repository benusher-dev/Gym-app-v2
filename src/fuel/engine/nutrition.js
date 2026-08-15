// Calorie and macro engine.
//
// BMR      — Katch-McArdle when a body-fat estimate is given (more accurate for
//            athletes carrying muscle), otherwise Mifflin-St Jeor.
// TDEE     — BMR x an activity multiplier set by weekly training load.
// Calories — TDEE shifted by the athlete's goal, then reconciled against their
//            target weight and floored so a cut never drops below BMR x 1.1.
// Protein  — driven by strength-training age, raised in a deficit, and switched
//            to a lean-mass basis when body fat is high enough that bodyweight
//            would overshoot.
// Fat      — 0.9-1.0 g/kg, allowed to compress to a 0.7 g/kg floor to protect
//            carbohydrate, which is the fuel that actually matters for rugby.
// Carbs    — whatever calories remain.

export const GOALS = [
  { id: 'mass', label: 'Gain Mass & Size, Keep Speed', shift: 0.15 },
  { id: 'recomp', label: 'Build Muscle & Lose Fat', shift: -0.2 },
  { id: 'strength', label: 'Speed, Strength & Size', shift: 0.07 },
  { id: 'conditioning', label: 'Fitness & Conditioning', shift: 0 },
]

export const LOADS = [
  { id: '2x', label: '2x / Week', mult: 1.45 },
  { id: '3-4x', label: '3–4x / Week', mult: 1.6 },
  { id: '5-6x', label: '5–6x / Week', mult: 1.75 },
  { id: 'daily', label: 'Daily / Pre-Season', mult: 1.9 },
]

export const TRAINING_AGES = [
  { id: 'never', label: 'Never Trained', protein: 2.0 },
  { id: 'under3', label: 'Under 3 Years', protein: 2.1 },
  { id: '3plus', label: '3+ Years', protein: 2.2 },
]

export const TRAIN_TIMES = [
  { id: 'morning', label: 'Morning (6–10am)' },
  { id: 'afternoon', label: 'Afternoon (1–5pm)' },
  { id: 'evening', label: 'Evening (5–9pm)' },
]

export const COOK_TIMES = [
  { id: 'minimal', label: 'Minimal (~10 min)', prep: 0 },
  { id: 'moderate', label: 'Moderate (~30 min)', prep: 1 },
  { id: 'plenty', label: 'Plenty (~60 min)', prep: 2 },
]

const byId = (list, id) => list.find(x => x.id === id) ?? list[0]

export function calcBMR({ sex, weight, height, age, bodyFat }) {
  if (bodyFat > 0 && bodyFat < 60) {
    const lbm = weight * (1 - bodyFat / 100)
    return { value: 370 + 21.6 * lbm, method: 'Katch-McArdle', lbm }
  }
  const base = 10 * weight + 6.25 * height - 5 * age
  return {
    value: sex === 'female' ? base - 161 : base + 5,
    method: 'Mifflin-St Jeor',
    lbm: null,
  }
}

export function buildTargets(input) {
  const { sex, weight, goalWeight, height, age, bodyFat, goal, load, trainingAge } = input

  const bmr = calcBMR({ sex, weight, height, age, bodyFat })
  const loadDef = byId(LOADS, load)
  const tdee = bmr.value * loadDef.mult

  const goalDef = byId(GOALS, goal)
  let shift = goalDef.shift
  const notes = []

  // Reconcile the stated goal against the target weight. Someone asking to build
  // muscle and lose fat while naming a target 5 kg above their current weight has
  // given two different instructions; bias toward the number they typed and say so.
  const delta = (goalWeight || weight) - weight
  if (delta > 2 && shift < 0) {
    shift = 0.08
    notes.push(
      `Your goal weight is ${delta.toFixed(1)} kg above where you are now, which needs a surplus — ` +
      `so this plan runs a small one rather than the deficit that goal usually implies. Expect a slower, leaner gain.`
    )
  } else if (delta < -2 && shift > 0) {
    shift = -0.18
    notes.push(
      `Your goal weight is ${Math.abs(delta).toFixed(1)} kg below where you are now, so this plan runs a deficit. ` +
      `Protein is held high to keep the size and speed you already have.`
    )
  }

  let calories = tdee * (1 + shift)
  const floor = bmr.value * 1.1
  if (calories < floor) {
    calories = floor
    notes.push('Calories were floored at 1.1x BMR — a harder cut than this costs you training quality.')
  }

  const inDeficit = calories < tdee

  // Protein
  const ageDef = byId(TRAINING_AGES, trainingAge)
  let proteinPerKg = ageDef.protein + (inDeficit ? 0.2 : 0)
  let proteinBasis = weight
  let proteinNote = `${proteinPerKg.toFixed(1)} g per kg bodyweight`
  if (bodyFat >= 20 && bmr.lbm) {
    proteinBasis = bmr.lbm
    proteinPerKg = inDeficit ? 2.8 : 2.6
    proteinNote = `${proteinPerKg.toFixed(1)} g per kg lean mass (${Math.round(bmr.lbm)} kg)`
  }
  const protein = Math.round(proteinPerKg * proteinBasis)

  // Fat — start at goal-appropriate, compress toward a floor if carbs get squeezed
  const fatPerKg = goal === 'mass' ? 1.0 : 0.9
  let fat = Math.round(fatPerKg * weight)
  const minFat = Math.round(0.7 * weight)

  let carbs = Math.round((calories - protein * 4 - fat * 9) / 4)
  const minCarbs = Math.round(3 * weight)
  if (carbs < minCarbs) {
    const shortfallKcal = (minCarbs - carbs) * 4
    const fatCut = Math.min(fat - minFat, Math.round(shortfallKcal / 9))
    if (fatCut > 0) {
      fat -= fatCut
      carbs = Math.round((calories - protein * 4 - fat * 9) / 4)
    }
  }
  if (carbs < 0) carbs = 0

  calories = Math.round(protein * 4 + carbs * 4 + fat * 9)

  // Timeline to goal weight
  const dailyDelta = calories - tdee
  let timeline = null
  if (Math.abs(delta) >= 1 && Math.abs(dailyDelta) > 50) {
    const weeks = Math.abs(delta) * 7700 / Math.abs(dailyDelta) / 7
    if ((delta > 0) === (dailyDelta > 0)) {
      timeline = {
        weeks: Math.round(weeks),
        direction: delta > 0 ? 'gain' : 'lose',
        kg: Math.abs(delta),
        perWeek: Math.abs(dailyDelta) * 7 / 7700,
      }
    }
  }

  const trainingDays = { '2x': 2, '3-4x': 3.5, '5-6x': 5.5, daily: 6.5 }[load] ?? 3.5
  const hydration = Math.round((weight * 35 + 750 * (trainingDays / 7)) / 100) * 100

  return {
    bmr: Math.round(bmr.value),
    bmrMethod: bmr.method,
    lbm: bmr.lbm ? Math.round(bmr.lbm) : null,
    tdee: Math.round(tdee),
    calories,
    protein,
    carbs,
    fat,
    proteinNote,
    proteinPerKg: +(protein / weight).toFixed(2),
    carbsPerKg: +(carbs / weight).toFixed(2),
    surplus: Math.round(dailyDelta),
    inDeficit,
    hydration,
    timeline,
    notes,
    goalLabel: goalDef.label,
    loadLabel: loadDef.label,
  }
}

// ── Meal splits ──────────────────────────────────────────────────────────────
// Each entry is a share of the day's calories. Slots shift with training time so
// the biggest carbohydrate feeds land either side of the session.

const SPLITS = {
  morning: [
    { slot: 'prefuel', label: 'Pre-Training', share: 0.12, timing: '60–90 min before' },
    { slot: 'post', label: 'Post-Training', share: 0.25, timing: 'Within 45 min after' },
    { slot: 'lunch', label: 'Lunch', share: 0.22, timing: 'Midday' },
    { slot: 'snack', label: 'Afternoon Snack', share: 0.11, timing: '3–4pm' },
    { slot: 'dinner', label: 'Dinner', share: 0.3, timing: 'Evening' },
  ],
  afternoon: [
    { slot: 'breakfast', label: 'Breakfast', share: 0.24, timing: 'On waking' },
    { slot: 'lunch', label: 'Lunch', share: 0.26, timing: '2–3 h before training' },
    { slot: 'prefuel', label: 'Pre-Training', share: 0.1, timing: '45–60 min before' },
    { slot: 'post', label: 'Post-Training', share: 0.14, timing: 'Within 45 min after' },
    { slot: 'dinner', label: 'Dinner', share: 0.26, timing: 'Evening' },
  ],
  evening: [
    { slot: 'breakfast', label: 'Breakfast', share: 0.24, timing: 'On waking' },
    { slot: 'lunch', label: 'Lunch', share: 0.28, timing: 'Midday' },
    { slot: 'prefuel', label: 'Pre-Training', share: 0.12, timing: '60–90 min before' },
    { slot: 'dinner', label: 'Dinner (Post-Training)', share: 0.26, timing: 'Within 60 min after' },
    { slot: 'snack', label: 'Before Bed', share: 0.1, timing: '30 min before sleep' },
  ],
}

export function mealSplit(trainTime, { skipBreakfast = false } = {}) {
  let split = (SPLITS[trainTime] ?? SPLITS.afternoon).map(m => ({ ...m }))

  if (skipBreakfast) {
    const bf = split.find(m => m.slot === 'breakfast' || m.slot === 'prefuel')
    if (bf && split.length > 3) {
      split = split.filter(m => m !== bf)
      const bump = bf.share / split.length
      split.forEach(m => { m.share += bump })
    }
  }

  const total = split.reduce((s, m) => s + m.share, 0)
  split.forEach(m => { m.share = m.share / total })
  return split
}
