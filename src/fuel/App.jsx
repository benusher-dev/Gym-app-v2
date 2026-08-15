import { useState } from 'react'
import { Hex } from './components/ui'
import { BRAND } from './brand'
import { FuelPlan } from './tabs/FuelPlan'
import { Training } from './tabs/Training'
import { PreWorkout } from './tabs/PreWorkout'

const IconPlan = props => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 3h6v3H9zM6 6h12v15H6z" />
    <path d="M9 11h6M9 15h4" />
  </svg>
)

const IconTraining = props => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 12h3l2.5-7 4 14 3-9 1.5 2H21" />
  </svg>
)

const IconBolt = props => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
  </svg>
)

const TABS = [
  { id: 'plan', label: 'Fuel Plan', Icon: IconPlan, Panel: FuelPlan },
  { id: 'training', label: 'Training', Icon: IconTraining, Panel: Training },
  { id: 'pre', label: 'Pre-Workout', Icon: IconBolt, Panel: PreWorkout },
]

export default function App() {
  const [tab, setTab] = useState('plan')
  const Active = TABS.find(t => t.id === tab).Panel

  return (
    <div className="min-h-dvh bg-white">
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
        <div className="max-w-lg mx-auto px-5 py-3.5 flex items-center gap-3">
          <span className="text-rdc-600 flex-shrink-0">
            <Hex className="h-9 w-9" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-[15px] font-bold uppercase tracking-[0.06em] text-neutral-900 leading-none">
              {BRAND.name}
            </p>
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-neutral-400 mt-1">
              {BRAND.sub}
            </p>
          </div>
        </div>

        <nav className="max-w-lg mx-auto px-2 flex">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 border-b-2 transition-colors ${
                tab === id
                  ? 'border-rdc-600 text-rdc-600'
                  : 'border-transparent text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em]">
                {label}
              </span>
            </button>
          ))}
        </nav>
      </header>

      <main>
        <Active />
      </main>

      <footer className="border-t border-neutral-200 py-6 px-5">
        <p className="max-w-lg mx-auto text-[11px] text-neutral-400 leading-relaxed text-center">
          General nutrition guidance for healthy adults in training — not medical advice.
          If you have a medical condition or are working with a dietitian, follow their plan over this one.
        </p>
      </footer>
    </div>
  )
}
