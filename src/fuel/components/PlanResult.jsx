import { useState } from 'react'
import { SectionLabel, Stat, Panel } from './ui'
import { describePortion, macrosOf } from '../engine/mealBuilder'
import { FOODS } from '../data/foods'

const money = n => `£${n.toFixed(2)}`
const r = n => Math.round(n)

function MacroBar({ protein, carbs, fat }) {
  const pk = protein * 4, ck = carbs * 4, fk = fat * 9
  const total = pk + ck + fk || 1
  const seg = [
    { k: 'Protein', v: pk, c: 'bg-steel-600' },
    { k: 'Carbs', v: ck, c: 'bg-steel-400' },
    { k: 'Fat', v: fk, c: 'bg-steel-200' },
  ]
  return (
    <div>
      <div className="flex h-2 rounded-full overflow-hidden">
        {seg.map(s => (
          <div key={s.k} className={s.c} style={{ width: `${(s.v / total) * 100}%` }} />
        ))}
      </div>
      <div className="flex gap-4 mt-2">
        {seg.map(s => (
          <div key={s.k} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${s.c}`} />
            <span className="text-[11px] text-neutral-500">
              {s.k} {Math.round((s.v / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Meal({ meal, weighMode }) {
  if (!meal.template) return null
  return (
    <div className="border-t border-[rgba(123,164,196,0.15)] pt-3.5 first:border-0 first:pt-0">
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className="lbl">{meal.label}</p>
          <p className="font-display text-[17px] font-semibold text-neutral-900 leading-tight mt-1">
            {meal.template.name}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-display text-[17px] font-semibold text-steel-600 leading-none">
            {r(meal.actual.kcal)}
          </p>
          <p className="text-[10px] text-neutral-400 mt-0.5">kcal</p>
        </div>
      </div>

      <p className="text-[11px] text-neutral-400 mt-0.5">{meal.timing}</p>

      <ul className="mt-2.5 flex flex-col gap-1">
        {meal.entries.filter(e => e.grams > 0).map((e, i) => (
          <li key={i} className="flex justify-between gap-3 text-[13px]">
            <span className="text-neutral-700">{FOODS[e.food].name}</span>
            <span className="text-neutral-500 tabular-nums flex-shrink-0">
              {describePortion(e.food, e.grams, weighMode)}
            </span>
          </li>
        ))}
      </ul>

      <p className="text-[11px] text-neutral-400 mt-2 tabular-nums">
        P {r(meal.actual.p)} g &middot; C {r(meal.actual.c)} g &middot; F {r(meal.actual.f)} g
      </p>

      {meal.template.note && (
        <p className="text-[12px] text-neutral-500 italic mt-2 leading-relaxed">
          {meal.template.note}
        </p>
      )}
    </div>
  )
}

export function PlanResult({
  targets, plan, shopping, swaps, budgetInfo, notes,
  cheapMode, onApplySwaps, onRestore,
}) {
  const [day, setDay] = useState(0)
  const [weighMode, setWeighMode] = useState('cooked')
  const current = plan[day]
  const totalSaving = swaps.reduce((s, x) => s + x.saving, 0)

  return (
    <div className="mt-12">
      {/* ── Targets ── */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-[#7ba4c4] to-[#6b8fae] text-white">
        <div className="px-5 py-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">
            Your Daily Target
          </p>
          <p className="font-display text-[52px] font-bold leading-none mt-2 tabular-nums">
            {targets.calories.toLocaleString()}
            <span className="font-body text-base font-medium text-white/50 ml-2">kcal</span>
          </p>
          <p className="text-[13px] text-white/70 mt-2">
            {targets.goalLabel} &middot; {targets.loadLabel}
          </p>

          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              ['Protein', targets.protein],
              ['Carbs', targets.carbs],
              ['Fat', targets.fat],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-white/10 px-3 py-2.5">
                <p className="font-display text-2xl font-bold leading-none tabular-nums">
                  {v}<span className="text-[12px] font-body font-medium text-white/50 ml-0.5">g</span>
                </p>
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/55 mt-1.5">
                  {k}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How the numbers were reached ── */}
      <div className="mt-4">
        <SectionLabel muted>How That Was Worked Out</SectionLabel>
        <Panel>
          <div className="grid grid-cols-2 gap-y-4 gap-x-3">
            <Stat value={targets.bmr.toLocaleString()} unit="kcal" label="BMR" />
            <Stat value={targets.tdee.toLocaleString()} unit="kcal" label="Maintenance" />
            <Stat
              value={`${targets.surplus > 0 ? '+' : ''}${targets.surplus}`}
              unit="kcal"
              label={targets.inDeficit ? 'Daily deficit' : 'Daily surplus'}
              tone="brand"
            />
            <Stat value={targets.hydration / 1000} unit="L" label="Water / day" tone="brand" />
          </div>

          <div className="mt-4 pt-4 border-t border-[rgba(123,164,196,0.18)]">
            <MacroBar protein={targets.protein} carbs={targets.carbs} fat={targets.fat} />
          </div>

          <ul className="mt-4 flex flex-col gap-1.5 text-[12px] text-neutral-500 leading-relaxed">
            <li>BMR via <span className="text-neutral-700">{targets.bmrMethod}</span>
              {targets.lbm && <> using {targets.lbm} kg lean mass</>}.</li>
            <li>Protein set at <span className="text-neutral-700">{targets.proteinNote}</span>.</li>
            <li>Carbs land at <span className="text-neutral-700">{targets.carbsPerKg} g/kg</span> — the fuel that drives repeat sprints.</li>
          </ul>
        </Panel>
      </div>

      {/* Timeline */}
      {targets.timeline && (
        <div className="mt-3 rounded-xl border border-steel-200 bg-steel-50 px-4 py-3.5">
          <p className="text-[13px] text-steel-800 leading-relaxed">
            At this intake you should {targets.timeline.direction}{' '}
            <strong>{targets.timeline.kg.toFixed(1)} kg in roughly {targets.timeline.weeks} weeks</strong>{' '}
            — about {targets.timeline.perWeek.toFixed(2)} kg per week.
          </p>
        </div>
      )}

      {/* Reconciliation notes */}
      {targets.notes.map((n, i) => (
        <div key={i} className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
          <p className="text-[13px] text-amber-900 leading-relaxed">{n}</p>
        </div>
      ))}

      {notes && (
        <div className="mt-3 rounded-xl bg-[rgba(123,164,196,0.05)] px-4 py-3.5">
          <p className="lbl-muted mb-1.5">Your Notes</p>
          <p className="text-[13px] text-neutral-600 leading-relaxed">{notes}</p>
        </div>
      )}

      {/* ── Meals ── */}
      <div className="mt-8">
        <SectionLabel>Your Meals</SectionLabel>
        <p className="text-[13px] text-neutral-500 leading-relaxed mb-3">
          Three rotating days so you are not eating the same plate all week.
        </p>

        {/* Cooked vs raw only changes the number shown. The macros are held against
            the as-sold weight either way — cooking removes water, not protein. */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex rounded-lg bg-steel-100 p-1 text-[11px] font-semibold">
            {[['cooked', 'Cooked weight'], ['raw', 'Raw & dry']].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setWeighMode(id)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  weighMode === id ? 'bg-white text-steel-800 shadow-sm' : 'text-steel-700/70 hover:text-steel-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-[12px] text-neutral-400 leading-relaxed mb-3">
          {weighMode === 'cooked'
            ? 'Meat, fish, rice, pasta and potatoes are cooked weights. Yoghurt, oils, nuts, bread and wraps are as-purchased.'
            : 'Everything is the weight you buy it at — meat and fish raw, rice and pasta dry.'}
        </p>

        <div className="flex gap-1 bg-[rgba(123,164,196,0.08)] p-1 rounded-lg mb-4">
          {plan.map((d, i) => (
            <button
              key={d.label}
              type="button"
              onClick={() => setDay(i)}
              className={`flex-1 py-2 rounded-md text-[11px] font-bold uppercase tracking-[0.1em] transition-colors ${
                day === i ? 'bg-white text-steel-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="rounded-xl bg-[rgba(123,164,196,0.05)] p-4 flex flex-col gap-3.5">
          {current.meals.map((m, i) => <Meal key={i} meal={m} weighMode={weighMode} />)}
        </div>

        <div className="flex justify-between items-baseline mt-3 px-1">
          <span className="lbl-muted">{current.label} Total</span>
          <span className="text-[13px] text-neutral-600 tabular-nums">
            {r(current.total.kcal).toLocaleString()} kcal &middot; P {r(current.total.p)} &middot;
            C {r(current.total.c)} &middot; F {r(current.total.f)}
          </span>
        </div>
      </div>

      {/* ── Shopping ── */}
      <div className="mt-8">
        <SectionLabel>Weekly Shopping List</SectionLabel>

        <div className="rounded-xl bg-[#3d4f5e] text-white px-5 py-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">
              Estimated Weekly Cost
            </p>
            <p className="font-display text-[34px] font-bold leading-none mt-1.5 tabular-nums">
              {money(shopping.total)}
            </p>
          </div>
          <p className="text-[12px] text-white/50 tabular-nums">{money(shopping.perDay)} / day</p>
        </div>

        {budgetInfo && (
          <div
            className={`mt-3 rounded-xl border px-4 py-3.5 ${
              budgetInfo.over
                ? 'border-amber-200 bg-amber-50'
                : 'border-emerald-200 bg-emerald-50'
            }`}
          >
            <p className={`text-[13px] leading-relaxed ${budgetInfo.over ? 'text-amber-900' : 'text-emerald-900'}`}>
              {budgetInfo.over ? (
                <>This comes in <strong>{money(-budgetInfo.diff)} over</strong> your {money(budgetInfo.budget)} budget
                  — {budgetInfo.pct}% of it.</>
              ) : (
                <>This fits your budget with <strong>{money(budgetInfo.diff)} to spare</strong>
                  {' '}— {budgetInfo.pct}% of {money(budgetInfo.budget)}.</>
              )}
            </p>
          </div>
        )}

        {swaps.length > 0 && (
          <div className="mt-3 rounded-xl bg-[rgba(123,164,196,0.05)] p-4">
            <p className="lbl-muted mb-2.5">Cheaper Swaps</p>
            <ul className="flex flex-col gap-2">
              {swaps.map(s => (
                <li key={s.from} className="flex items-center justify-between gap-3 text-[13px]">
                  <span className="text-neutral-600 min-w-0">
                    <span className="line-through text-neutral-400">{s.fromName}</span>
                    <span className="mx-1.5 text-neutral-300">&rarr;</span>
                    <span className="text-neutral-800">{s.toName}</span>
                  </span>
                  <span className="text-emerald-600 font-semibold tabular-nums flex-shrink-0">
                    &minus;{money(s.saving)}
                  </span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={onApplySwaps}
              className="mt-3.5 w-full rounded-lg border border-steel-600 text-steel-600 hover:bg-steel-50
                         py-2.5 font-display text-[13px] font-semibold uppercase tracking-wide transition-colors"
            >
              Rebuild on the cheapest options &middot; save {money(totalSaving)}
            </button>
          </div>
        )}

        {cheapMode && (
          <div className="mt-3 rounded-xl border border-steel-200 bg-steel-50 px-4 py-3.5 flex items-center justify-between gap-3">
            <p className="text-[13px] text-steel-800">Built on the cheapest options that fit your food rules.</p>
            <button
              type="button"
              onClick={onRestore}
              className="text-[12px] font-semibold text-steel-600 underline underline-offset-2 flex-shrink-0"
            >
              Undo
            </button>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-4">
          {shopping.groups.map(g => (
            <div key={g.cat}>
              <p className="lbl-muted mb-2">{g.label}</p>
              <ul className="flex flex-col gap-1.5">
                {g.items.map(item => (
                  <li key={item.food} className="flex items-baseline justify-between gap-3 text-[13px]">
                    <span className="text-neutral-700">{item.name}</span>
                    <span className="flex items-baseline gap-3 flex-shrink-0 tabular-nums">
                      <span className="text-neutral-500">
                        {item.grams >= 1000
                          ? `${(item.grams / 1000).toFixed(1)} kg`
                          : `${r(item.grams)} g`}
                      </span>
                      <span className="text-neutral-400 w-12 text-right">{money(item.cost)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-neutral-400 mt-5 leading-relaxed">
          Quantities are purchase weights — meat and fish raw, rice and pasta dry —
          whichever way the meals above are displayed. Prices are indicative UK
          supermarket averages and drift with store and offers, so treat the total
          as a guide rather than a quote.
        </p>
      </div>
    </div>
  )
}
