import { useState, useRef } from 'react'
import { SectionLabel, Pill, Field } from '../components/ui'
import { PlanResult } from '../components/PlanResult'
import {
  GOALS, LOADS, TRAINING_AGES, TRAIN_TIMES, COOK_TIMES,
  buildTargets, mealSplit,
} from '../engine/nutrition'
import { buildPlan } from '../engine/mealBuilder'
import { buildShoppingList, cheaperSwaps, budgetStatus } from '../engine/shopping'
import { DIET_GROUPS, AVOID_FLAGS } from '../data/foods'

const SKIP_BREAKFAST_RE = /skip(ping)? breakfast|no breakfast|intermittent|fast(ing)? (until|til|till)/i

export function FuelPlan() {
  const [sex, setSex] = useState('male')
  const [weight, setWeight] = useState('')
  const [goalWeight, setGoalWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [bodyFat, setBodyFat] = useState('')
  const [goal, setGoal] = useState('mass')
  const [load, setLoad] = useState('5-6x')
  const [trainingAge, setTrainingAge] = useState('never')
  const [eats, setEats] = useState(['red-meat', 'poultry', 'fish', 'eggs', 'dairy'])
  const [avoids, setAvoids] = useState([])
  const [trainTime, setTrainTime] = useState('afternoon')
  const [cookTime, setCookTime] = useState('moderate')
  const [notes, setNotes] = useState('')
  const [budget, setBudget] = useState('')

  const [result, setResult] = useState(null)
  const [cheapMode, setCheapMode] = useState(false)
  const [error, setError] = useState('')
  const resultRef = useRef(null)

  function toggle(list, setList, id) {
    setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id])
  }

  function build(cheapest = false) {
    const w = parseFloat(weight)
    const h = parseFloat(height)
    const a = parseFloat(age)

    if (!w || !h || !a) {
      setError('Current weight, height and age are needed to work out your numbers.')
      return
    }
    if (eats.length === 0) {
      setError('Pick at least one food group so there is something to build meals from.')
      return
    }
    setError('')

    const targets = buildTargets({
      sex, weight: w, goalWeight: parseFloat(goalWeight) || w,
      height: h, age: a, bodyFat: parseFloat(bodyFat) || 0,
      goal, load, trainingAge,
    })

    const skipBreakfast = SKIP_BREAKFAST_RE.test(notes)
    const split = mealSplit(trainTime, { skipBreakfast })
    const prefs = {
      eats, avoids,
      cookPrep: COOK_TIMES.find(c => c.id === cookTime).prep,
      cheapest,
    }

    const plan = buildPlan(targets, split, prefs)
    const shopping = buildShoppingList(plan)

    setCheapMode(cheapest)
    setResult({
      targets,
      plan,
      shopping,
      swaps: cheapest ? [] : cheaperSwaps(shopping, eats, avoids),
      budgetInfo: budgetStatus(shopping.total, parseFloat(budget) || 0),
      skipBreakfast,
      notes: notes.trim(),
    })

    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <div className="px-4 pb-10 pt-4 max-w-lg mx-auto">
      <p className="text-[13px] text-neutral-500 leading-relaxed">
        Fill in your details and get calories, macros, three rotating days of meals
        and a costed shopping list.
      </p>

      <div className="mt-6 flex flex-col gap-7">
        {/* Sex */}
        <div>
          <SectionLabel>You Are</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            {['male', 'female'].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setSex(s)}
                className={`rounded-lg py-2.5 text-[14px] font-semibold border transition-colors ${
                  sex === s
                    ? 'bg-steel-600 border-steel-600 text-white'
                    : 'bg-white border-neutral-200 text-neutral-700 hover:border-steel-300'
                }`}
              >
                {s === 'male' ? 'Male' : 'Female'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div>
          <SectionLabel>Your Stats</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Current weight (kg)" type="number" inputMode="decimal" placeholder="e.g. 85"
              value={weight} onChange={e => setWeight(e.target.value)} />
            <Field label="Goal weight (kg)" type="number" inputMode="decimal" placeholder="e.g. 90"
              value={goalWeight} onChange={e => setGoalWeight(e.target.value)} />
            <Field label="Height (cm)" type="number" inputMode="decimal" placeholder="e.g. 178"
              value={height} onChange={e => setHeight(e.target.value)} />
            <Field label="Age" type="number" inputMode="numeric" placeholder="e.g. 24"
              value={age} onChange={e => setAge(e.target.value)} />
          </div>
          <div className="mt-3 w-1/2 pr-1.5">
            <Field label="Body fat % (estimate)" type="number" inputMode="decimal" placeholder="e.g. 18"
              value={bodyFat} onChange={e => setBodyFat(e.target.value)} />
          </div>
          <p className="text-[11px] text-neutral-400 mt-1.5">
            Body fat is optional — add it and your BMR is calculated from lean mass instead.
          </p>
        </div>

        {/* Goal */}
        <div>
          <SectionLabel>What&rsquo;s Your Main Goal?</SectionLabel>
          <div className="flex flex-col items-start gap-2">
            {GOALS.map(g => (
              <Pill key={g.id} active={goal === g.id} onClick={() => setGoal(g.id)}>
                {g.label}
              </Pill>
            ))}
          </div>
        </div>

        {/* Load */}
        <div>
          <SectionLabel>Training Load</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {LOADS.map(l => (
              <Pill key={l.id} active={load === l.id} onClick={() => setLoad(l.id)}>
                {l.label}
              </Pill>
            ))}
          </div>
        </div>

        {/* Training age */}
        <div>
          <SectionLabel>Strength Training Age</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {TRAINING_AGES.map(t => (
              <Pill key={t.id} active={trainingAge === t.id} onClick={() => setTrainingAge(t.id)}>
                {t.label}
              </Pill>
            ))}
          </div>
        </div>

        {/* Foods */}
        <div>
          <SectionLabel>Foods You Eat</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {DIET_GROUPS.map(d => (
              <Pill key={d.id} active={eats.includes(d.id)} onClick={() => toggle(eats, setEats, d.id)}>
                {d.label}
              </Pill>
            ))}
          </div>
        </div>

        {/* Avoid */}
        <div>
          <SectionLabel muted>Intolerances / Avoid</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {AVOID_FLAGS.map(a => (
              <Pill key={a.id} active={avoids.includes(a.id)} onClick={() => toggle(avoids, setAvoids, a.id)}>
                {a.label}
              </Pill>
            ))}
          </div>
        </div>

        {/* Routine */}
        <div>
          <SectionLabel>Your Routine</SectionLabel>
          {/* Stacked rather than side by side — the option text is too long to
              survive a half-width select on a narrow phone. */}
          <div className="flex flex-col gap-3">
            <label className="block">
              <span className="block text-[13px] text-neutral-600 mb-1">Training time of day</span>
              <select className="fld" value={trainTime} onChange={e => setTrainTime(e.target.value)}>
                {TRAIN_TIMES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="block text-[13px] text-neutral-600 mb-1">Cooking time available</span>
              <select className="fld" value={cookTime} onChange={e => setCookTime(e.target.value)}>
                {COOK_TIMES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </label>
          </div>
        </div>

        {/* Notes */}
        <div>
          <SectionLabel muted>Anything Else? (Optional)</SectionLabel>
          <textarea
            rows={3}
            className="fld resize-none"
            placeholder="e.g. I skip breakfast, travel a lot, game on Saturday, coming back from injury…"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
          {SKIP_BREAKFAST_RE.test(notes) && (
            <p className="text-[11px] text-steel-600 mt-1.5 font-medium">
              Picked up that you skip breakfast — the plan will fold those calories into your other meals.
            </p>
          )}
        </div>

        {/* Budget */}
        <div>
          <SectionLabel muted>Weekly Food Budget (Optional)</SectionLabel>
          <div className="rounded-xl bg-[rgba(123,164,196,0.05)] p-4">
            <p className="text-[13px] text-neutral-600 leading-relaxed">
              Enter your weekly grocery budget and the plan will be costed against it,
              with cheaper swaps if it comes in over.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="font-display text-lg font-semibold text-neutral-400">£</span>
              <input
                type="number" inputMode="decimal" placeholder="e.g. 70"
                className="fld flex-1 bg-white"
                value={budget}
                onChange={e => setBudget(e.target.value)}
              />
              <span className="text-[12px] text-neutral-400 whitespace-nowrap">£ / week</span>
            </div>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-steel-50 border border-steel-200 px-4 py-3 text-[13px] text-steel-700">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={() => build(false)}
          className="w-full rounded-lg bg-steel-600 hover:bg-steel-700 active:scale-[0.99] transition-all
                     py-4 flex items-center justify-center gap-2.5 text-white
                     font-display text-[17px] font-semibold uppercase tracking-wide"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
          </svg>
          Build My Fuel Plan
        </button>
      </div>

      <div ref={resultRef} className="scroll-mt-28">
        {result && (
          <PlanResult
            {...result}
            cheapMode={cheapMode}
            onApplySwaps={() => build(true)}
            onRestore={() => build(false)}
          />
        )}
      </div>
    </div>
  )
}
