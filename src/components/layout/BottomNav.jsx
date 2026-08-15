import { useApp } from '../../store/AppContext'

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Home',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'workouts',
    label: 'Workouts',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
      </svg>
    ),
  },
  {
    id: 'log',
    label: 'Log',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    id: 'history',
    label: 'History',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: 'fuel',
    label: 'Fuel',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 8.6c1.2-1.2 3-1.6 4.4-.5 1.7 1.3 2 4 .8 6.6-1 2.1-2.4 3.8-3.6 3.8-.7 0-1.1-.4-1.6-.4s-.9.4-1.6.4c-1.2 0-2.6-1.7-3.6-3.8-1.2-2.6-.9-5.3.8-6.6 1.4-1.1 3.2-.7 4.4.5z" />
        <path d="M12 8.6c0-1.8 1.3-3.2 3-3.4" />
      </svg>
    ),
  },
  {
    id: 'progress',
    label: 'Progress',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
]

export function BottomNav() {
  const { activePage, setActivePage, workoutStep } = useApp()
  const workoutLive = workoutStep === 2

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#7ba4c4] to-[#6b8fae] dark:from-amber-600 dark:to-orange-700 shadow-lg shadow-[#7ba4c4]/30 dark:shadow-amber-600/30 z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-stretch max-w-lg mx-auto">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 px-1 transition-colors rounded-none ${
              activePage === item.id
                ? 'text-white'
                : 'text-white/60 hover:text-white/90'
            }`}
          >
            {activePage === item.id ? (
              <div className="flex flex-col items-center gap-0.5 bg-white/20 rounded-xl px-3 py-1 w-full relative">
                {item.icon}
                <span className="text-[10px] font-semibold">{item.label}</span>
                {item.id === 'log' && workoutLive && (
                  <span className="absolute top-1 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                  </span>
                )}
              </div>
            ) : (
              <div className="relative flex flex-col items-center gap-0.5">
                {item.icon}
                <span className="text-[10px] font-medium">{item.label}</span>
                {item.id === 'log' && workoutLive && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                  </span>
                )}
              </div>
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
