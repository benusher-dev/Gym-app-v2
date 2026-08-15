import { useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { FuelPlan } from '../fuel/tabs/FuelPlan'
import { Training } from '../fuel/tabs/Training'
import { PreWorkout } from '../fuel/tabs/PreWorkout'

const TABS = [
  { id: 'plan', label: 'Fuel Plan', Panel: FuelPlan },
  { id: 'training', label: 'Training', Panel: Training },
  { id: 'pre', label: 'Pre-Workout', Panel: PreWorkout },
]

export function Fuel() {
  const [tab, setTab] = useState('plan')
  const Active = TABS.find(t => t.id === tab).Panel

  return (
    // The fuel screens are light-only by design, so the surface is pinned rather
    // than inheriting the tracker's dark background and leaving light cards on it.
    <div className="flex flex-col h-full bg-[#f7f9fb] text-neutral-900">
      <PageHeader title="Fuel" />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto w-full px-4 pt-4">
          <div className="flex gap-1 bg-[rgba(123,164,196,0.08)] p-1 rounded-xl">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  tab === t.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-[#5a7a96] hover:text-[#7ba4c4]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <Active />

        <p className="max-w-lg mx-auto px-5 pb-10 text-[11px] text-neutral-400 leading-relaxed text-center">
          General nutrition guidance for healthy adults in training — not medical advice.
          If you have a medical condition or work with a dietitian, follow their plan over this one.
        </p>
      </div>
    </div>
  )
}
