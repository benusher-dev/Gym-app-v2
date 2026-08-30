import { AppProvider, useApp } from './store/AppContext'
import { BottomNav } from './components/layout/BottomNav'
import { Dashboard } from './pages/Dashboard'
import { Workouts } from './pages/Workouts'
import { LogWorkout } from './pages/LogWorkout'
import { History } from './pages/History'
import { Progress } from './pages/Progress'
import { BodyWeightPage } from './pages/BodyWeightPage'
import { Fuel } from './pages/Fuel'

function Pages() {
  const { activePage } = useApp()

  return (
    <main
      className="flex flex-col h-dvh pb-[calc(4rem+env(safe-area-inset-bottom))] bg-[#f7f9fb] dark:bg-gray-900"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex-1 overflow-hidden flex flex-col">
        {activePage === 'dashboard'   && <Dashboard />}
        {activePage === 'workouts'    && <Workouts />}
        {/* LogWorkout stays mounted to preserve timer/state across tab switches */}
        <div className={activePage === 'log' ? 'flex-1 min-h-0 flex flex-col' : 'hidden'}>
          <LogWorkout />
        </div>
        {activePage === 'history'     && <History />}
        {activePage === 'progress'    && <Progress />}
        {activePage === 'bodyweight'  && <BodyWeightPage />}
        {activePage === 'fuel'        && <Fuel />}
      </div>
    </main>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Pages />
      <BottomNav />
    </AppProvider>
  )
}
