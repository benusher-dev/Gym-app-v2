import { FOODS, pickFood, foodAllowed } from '../data/foods'
import { MEAL_TEMPLATES } from '../data/mealTemplates'

const MACRO_KEY = { protein: 'p', carb: 'c', fat: 'f' }

// How each slot pulls its macros around. Pre- and post-training meals are pushed
// toward carbohydrate and away from fat; the surrounding meals absorb what is left.
// These are weights, not final numbers — they get normalised so the day still
// lands exactly on the athlete's targets.
const SLOT_BIAS = {
  prefuel: { protein: 0.7, carb: 1.45, fat: 0.3 },
  post: { protein: 1.15, carb: 1.35, fat: 0.35 },
  breakfast: { protein: 1.0, carb: 1.0, fat: 1.1 },
  lunch: { protein: 1.0, carb: 0.95, fat: 1.15 },
  dinner: { protein: 1.05, carb: 0.9, fat: 1.25 },
  snack: { protein: 1.0, carb: 0.95, fat: 1.15 },
}

const LIMITS = {
  protein: { min: 15, max: 400 },
  carb: { min: 10, max: 450 },
  fat: { min: 0, max: 120 },
}

function roundTo(grams, food) {
  const step = food.gPerUnit ?? food.step ?? 5
  return Math.max(0, Math.round(grams / step) * step)
}

/**
 * Portion text for one entry.
 *
 * `mode` is 'cooked' or 'raw'. Macros are always held against the as-sold weight
 * — cooking drives off water, it does not change the protein in a chicken breast
 * — so this converts the number shown without touching any of the arithmetic.
 * Foods eaten as sold (yoghurt, oil, bread, nuts) read the same either way.
 */
export function describePortion(foodId, grams, mode = 'raw') {
  const f = FOODS[foodId]
  if (!f) return `${Math.round(grams)} g`

  const factor = f.cooked ?? 1
  const converts = factor !== 1
  const shown = mode === 'cooked' && converts ? grams * factor : grams

  // Units only make sense as-sold — three eggs are three eggs however they cook.
  if (f.gPerUnit) {
    const units = Math.round(grams / f.gPerUnit)
    const label = f.unit === 'each' ? '' : ` ${f.unit}${units === 1 ? '' : 's'}`
    return `${units}${label} (${Math.round(grams)} g)`
  }

  const qualifier = converts ? (mode === 'cooked' ? ' cooked' : ` ${f.weighAs ?? 'raw'}`) : ''
  return `${Math.round(shown / 5) * 5} g${qualifier}`
}

export function macrosOf(foodId, grams) {
  const f = FOODS[foodId]
  if (!f) return { kcal: 0, p: 0, c: 0, f: 0 }
  const k = grams / 100
  return {
    kcal: f.per100.kcal * k,
    p: f.per100.p * k,
    c: f.per100.c * k,
    f: f.per100.f * k,
  }
}

function sumMacros(entries) {
  return entries.reduce(
    (acc, e) => {
      const m = macrosOf(e.food, e.grams)
      acc.kcal += m.kcal; acc.p += m.p; acc.c += m.c; acc.f += m.f
      return acc
    },
    { kcal: 0, p: 0, c: 0, f: 0 }
  )
}

/** Resolve a template's option lists into concrete foods, or null if unusable. */
function resolveTemplate(tpl, eats, avoids, cheapest) {
  const entries = []
  for (const item of tpl.items) {
    if (item.role === 'fixed') {
      if (!foodAllowed(item.food, eats, avoids)) return null
      entries.push({ role: 'fixed', food: item.food, grams: item.grams })
      continue
    }
    if (item.role === 'veg') {
      const food = pickFood(item.options, eats, avoids, cheapest)
      if (!food) return null
      entries.push({ role: 'veg', food, grams: item.grams ?? 150 })
      continue
    }
    const food = pickFood(item.options, eats, avoids, cheapest)
    if (!food) return null
    entries.push({ role: item.role, food, grams: 0 })
  }
  return entries
}

/**
 * Size the scalable entries so the meal lands on its macro target.
 * Each pass solves one macro against the current contribution of every other
 * item, so overlapping foods (oats carry protein, nut butter carries carbs)
 * settle out over a few iterations rather than being double-counted.
 */
const floorFor = entry => Math.max(LIMITS[entry.role].min, FOODS[entry.food].min ?? 0)
const ceilFor = entry => Math.min(LIMITS[entry.role].max, FOODS[entry.food].max ?? Infinity)

// Slots that should always land a real protein feed. Spreading protein across
// four or five doses beats stacking it into two, so a main meal keeps its
// protein source even when the carbohydrate around it already covers the target.
const MAIN_SLOTS = new Set(['breakfast', 'lunch', 'dinner', 'post'])

function solvePortions(entries, target, { protectProtein = false } = {}) {
  const scalable = entries.filter(e => e.role in MACRO_KEY)
  scalable.forEach(e => {
    e.grams = { protein: 120, carb: 60, fat: 12 }[e.role]
    e.dropped = false
  })

  function relax(useFloors) {
    for (let pass = 0; pass < 3; pass++) {
      for (const entry of scalable) {
        if (entry.dropped) { entry.grams = 0; continue }
        const key = MACRO_KEY[entry.role]
        const per = FOODS[entry.food].per100[key] / 100
        if (per < 0.005) continue
        const others = entries
          .filter(e => e !== entry)
          .reduce((s, e) => s + macrosOf(e.food, e.grams)[key], 0)
        const want = (target[entry.role] - others) / per
        entry.grams = Math.min(
          ceilFor(entry),
          Math.max(useFloors ? floorFor(entry) : 0, want)
        )
      }
    }
  }

  // First solve with no floors, to see what the meal mathematically wants.
  relax(false)

  // Anything wanted at well under a real serving gets dropped rather than pinned
  // at its floor — a pre-training rice bowl does not need 100 g of chicken in it
  // just because the template offered a protein slot. Pinning instead of dropping
  // is what pushes a day's protein far past target once five meals each do it.
  const keptCount = () => entries.filter(e => !e.dropped).length
  for (const entry of scalable) {
    // A main meal keeps its protein source regardless — dropping it leaves a
    // dish named for a protein it no longer contains, and wrecks the spread of
    // protein across the day even when the daily total still adds up.
    if (protectProtein && entry.role === 'protein') continue
    if (entry.grams < floorFor(entry) * 0.6 && keptCount() > 2) entry.dropped = true
  }

  // Resize what survived, now respecting practical serving sizes.
  relax(true)

  const kept = entries.filter(e => !e.dropped)
  kept.forEach(e => {
    if (e.role in MACRO_KEY) e.grams = roundTo(e.grams, FOODS[e.food])
  })
  return kept
}

/** Templates that fit this slot, the athlete's kitchen time, and their food rules. */
function candidatesFor(slot, prefs) {
  return MEAL_TEMPLATES.filter(
    t =>
      t.slots.includes(slot) &&
      t.prep <= prefs.cookPrep &&
      resolveTemplate(t, prefs.eats, prefs.avoids, prefs.cheapest) !== null
  )
}

/** Pick a template per slot and resolve its foods, before any portioning happens. */
function chooseTemplates(split, prefs, variant) {
  return split.map((m, i) => {
    let cands = candidatesFor(m.slot, prefs)
    if (cands.length === 0) {
      // Widen the kitchen-time constraint before giving up on the slot.
      cands = MEAL_TEMPLATES.filter(
        t => t.slots.includes(m.slot) &&
             resolveTemplate(t, prefs.eats, prefs.avoids, prefs.cheapest) !== null
      )
    }
    if (cands.length === 0) return { ...m, template: null, base: [] }

    const tpl = cands[(variant + i) % cands.length]
    return {
      ...m,
      template: tpl,
      base: resolveTemplate(tpl, prefs.eats, prefs.avoids, prefs.cheapest),
    }
  })
}

/**
 * Share each macro across the meals that can actually deliver it.
 *
 * A post-training shake has no fat item, so giving it a fat target just loses
 * that fat from the day. Allocating per macro only over the meals holding a
 * matching scalable role keeps the day's totals honest.
 */
function allocate(chosen, targets, correction) {
  const daily = { protein: targets.protein, carb: targets.carbs, fat: targets.fat }

  const weights = chosen.map(m => {
    const bias = SLOT_BIAS[m.slot] ?? { protein: 1, carb: 1, fat: 1 }
    const has = role => m.base.some(e => e.role === role)
    return {
      protein: has('protein') ? m.share * bias.protein : 0,
      carb: has('carb') ? m.share * bias.carb : 0,
      fat: has('fat') ? m.share * bias.fat : 0,
    }
  })

  const sums = {
    protein: weights.reduce((s, w) => s + w.protein, 0),
    carb: weights.reduce((s, w) => s + w.carb, 0),
    fat: weights.reduce((s, w) => s + w.fat, 0),
  }

  return chosen.map((m, i) => ({
    protein: sums.protein ? daily.protein * correction.protein * (weights[i].protein / sums.protein) : 0,
    carb: sums.carb ? daily.carb * correction.carb * (weights[i].carb / sums.carb) : 0,
    fat: sums.fat ? daily.fat * correction.fat * (weights[i].fat / sums.fat) : 0,
  }))
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

/**
 * Build one day of meals.
 * `variant` rotates template choice so a three-day plan does not repeat itself.
 *
 * Portions are solved twice: the first pass hits the per-meal targets, then the
 * day is measured and the targets nudged to absorb whatever the fixed items and
 * rounding contributed, so the day total lands close to the athlete's numbers.
 */
export function buildDay(targets, split, prefs, variant = 0) {
  const chosen = chooseTemplates(split, prefs, variant)
  let correction = { protein: 1, carb: 1, fat: 1 }


  // Serving floors make this a discrete problem: nudging the correction can tip a
  // single item between "dropped" and "a full serving", which jumps the day's
  // totals rather than easing them. Iterating and keeping the closest attempt is
  // more reliable than trusting the last one to have landed well.
  let best = null
  let bestErr = Infinity

  for (let pass = 0; pass < 6; pass++) {
    const alloc = allocate(chosen, targets, correction)

    const meals = chosen.map((m, i) => {
      if (!m.template) {
        return { ...m, entries: [], actual: { kcal: 0, p: 0, c: 0, f: 0 }, target: alloc[i] }
      }
      // Main meals keep their protein item, but are not forced up to a dose —
      // the food's own minimum serving is enough to guarantee a real feed, and
      // forcing a floor on top of that overshoots the day badly on high-carb plans.
      const entries = solvePortions(m.base.map(e => ({ ...e })), alloc[i], {
        protectProtein: MAIN_SLOTS.has(m.slot),
      })
      return { ...m, entries, actual: sumMacros(entries), target: alloc[i] }
    })

    const tot = meals.reduce(
      (a, m) => ({ p: a.p + m.actual.p, c: a.c + m.actual.c, f: a.f + m.actual.f }),
      { p: 0, c: 0, f: 0 }
    )

    const err =
      Math.abs(tot.p - targets.protein) / targets.protein +
      Math.abs(tot.c - targets.carbs) / targets.carbs +
      Math.abs(tot.f - targets.fat) / targets.fat
    if (err < bestErr) { bestErr = err; best = meals }

    correction = {
      protein: clamp(correction.protein * (targets.protein / (tot.p || 1)), 0.4, 2.5),
      carb: clamp(correction.carb * (targets.carbs / (tot.c || 1)), 0.4, 2.5),
      fat: clamp(correction.fat * (targets.fat / (tot.f || 1)), 0.4, 2.5),
    }
  }

  const dayTotal = best.reduce(
    (acc, meal) => {
      acc.kcal += meal.actual.kcal; acc.p += meal.actual.p
      acc.c += meal.actual.c; acc.f += meal.actual.f
      return acc
    },
    { kcal: 0, p: 0, c: 0, f: 0 }
  )

  return { meals: best, total: dayTotal }
}

/** Three rotating days, so the athlete is not eating an identical plate all week. */
export function buildPlan(targets, split, prefs, days = 3) {
  return Array.from({ length: days }, (_, i) => ({
    label: `Day ${String.fromCharCode(65 + i)}`,
    ...buildDay(targets, split, prefs, i),
  }))
}
