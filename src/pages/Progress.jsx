import { useState, useMemo } from 'react'
import { useApp } from '../store/AppContext'
import { PageHeader } from '../components/layout/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { ProgressChart } from '../components/progress/ProgressChart'
import { formatDate } from '../utils/dateHelpers'
import { useBodyWeight } from '../hooks/useBodyWeight'

const METRICS = [
  { id: 'maxWeight', label: 'Max Weight (kg)' },
  { id: 'totalVolume', label: 'Total Volume (kg)' },
  { id: 'totalReps', label: 'Total Reps' },
]

function computeMetric(sets, metricId) {
  if (!sets || sets.length === 0) return 0
  if (metricId === 'maxWeight') return Math.max(...sets.map(s => s.weight || 0))
  if (metricId === 'totalVolume') return sets.reduce((sum, s) => sum + (s.reps || 0) * (s.weight || 0), 0)
  if (metricId === 'totalReps') return sets.reduce((sum, s) => sum + (s.reps || 0), 0)
  return 0
}

// ── Exercise progress tab ────────────────────────────────────────────────────
function ExerciseTab({ sessions, setActivePage }) {
  const [selectedExercise, setSelectedExercise] = useState('')
  const [metric, setMetric] = useState('maxWeight')

  const exerciseNames = useMemo(() => {
    const names = new Set()
    sessions.forEach(s => s.exercises.forEach(ex => names.add(ex.name)))
    return [...names].sort()
  }, [sessions])

  const chartData = useMemo(() => {
    if (!selectedExercise) return []
    return sessions
      .filter(s => s.exercises.some(ex => ex.name === selectedExercise))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(s => {
        const ex = s.exercises.find(ex => ex.name === selectedExercise)
        return { date: s.date, value: computeMetric(ex.sets, metric) }
      })
  }, [sessions, selectedExercise, metric])

  const selectedMetric = METRICS.find(m => m.id === metric)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-bold uppercase tracking-[0.08em] text-[#94a3b8] block mb-1.5">Exercise</label>
        <select
          value={selectedExercise}
          onChange={e => setSelectedExercise(e.target.value)}
          className="w-full rounded-xl bg-white dark:bg-gray-700 dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ba4c4]/40"
        >
          <option value="">Choose an exercise…</option>
          {exerciseNames.map(name => <option key={name} value={name}>{name}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-[0.08em] text-[#94a3b8] block mb-1.5">Metric</label>
        <div className="flex gap-2">
          {METRICS.map(m => (
            <button
              key={m.id}
              onClick={() => setMetric(m.id)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-colors ${metric === m.id ? 'bg-[#7ba4c4] text-white' : 'bg-[rgba(123,164,196,0.08)] text-[#5a7a96] hover:bg-[rgba(123,164,196,0.15)]'}`}
            >
              {m.label.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>
      {selectedExercise ? (
        <div className="bg-[rgba(123,164,196,0.05)] rounded-2xl p-4">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{selectedExercise} — {selectedMetric.label}</p>
          <ProgressChart data={chartData} metric={selectedMetric.label} />
          {chartData.length > 0 && (
            <div className="mt-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#94a3b8] mb-2">Data Table</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-[#94a3b8]">
                      <th className="text-left pb-1.5">Date</th>
                      <th className="text-right pb-1.5">{selectedMetric.label}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...chartData].reverse().map((d, i) => (
                      <tr key={i} className="even:bg-[rgba(123,164,196,0.04)]">
                        <td className="py-1 text-sm text-gray-600 dark:text-gray-400">{formatDate(d.date)}</td>
                        <td className="py-1 text-right font-semibold text-[#7ba4c4]">{d.value.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-[#94a3b8] text-sm">Select an exercise to view progress</div>
      )}
    </div>
  )
}

// ── Personal Records tab ─────────────────────────────────────────────────────
function RecordsTab({ sessions }) {
  const records = useMemo(() => {
    const map = {}
    sessions.forEach(s => {
      s.exercises.forEach(ex => {
        const key = ex.name
        if (!map[key]) map[key] = { name: key, maxWeight: 0, maxReps: 0, maxVolume: 0, date: s.date }
        ex.sets.forEach(set => {
          if ((set.weight || 0) > map[key].maxWeight) {
            map[key].maxWeight = set.weight || 0
            map[key].maxWeightDate = s.date
          }
          if ((set.reps || 0) > map[key].maxReps) {
            map[key].maxReps = set.reps || 0
          }
          const vol = (set.reps || 0) * (set.weight || 0)
          if (vol > map[key].maxVolume) {
            map[key].maxVolume = vol
            map[key].maxVolumeDate = s.date
          }
        })
      })
    })
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name))
  }, [sessions])

  if (records.length === 0) {
    return <div className="text-center py-8 text-[#94a3b8] text-sm">Log some workouts to see your personal records</div>
  }

  return (
    <div className="flex flex-col gap-3">
      {records.map(r => (
        <div key={r.name} className="bg-[rgba(123,164,196,0.05)] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 w-5 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px]">★</span>
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{r.name}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {r.maxWeight > 0 && (
              <div className="text-center">
                <p className="text-lg font-bold text-[#7ba4c4]">{r.maxWeight}<span className="text-xs font-normal text-[#94a3b8]">kg</span></p>
                <p className="text-[9px] text-[#94a3b8] font-bold uppercase tracking-wide mt-0.5">Max Weight</p>
              </div>
            )}
            <div className="text-center">
              <p className="text-lg font-bold text-[#7ba4c4]">{r.maxReps}</p>
              <p className="text-[9px] text-[#94a3b8] font-bold uppercase tracking-wide mt-0.5">Max Reps</p>
            </div>
            {r.maxVolume > 0 && (
              <div className="text-center">
                <p className="text-lg font-bold text-[#7ba4c4]">{r.maxVolume.toLocaleString()}<span className="text-xs font-normal text-[#94a3b8]">kg</span></p>
                <p className="text-[9px] text-[#94a3b8] font-bold uppercase tracking-wide mt-0.5">Best Set Vol</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Body Weight tab ──────────────────────────────────────────────────────────
function BodyWeightTab() {
  const { entries, logWeight, deleteEntry } = useBodyWeight()
  const [inputVal, setInputVal] = useState('')
  const [unit, setUnit] = useState('kg')

  function handleSave() {
    const num = parseFloat(inputVal)
    if (!num || num <= 0) return
    const inKg = unit === 'lbs' ? +(num * 0.453592).toFixed(1) : num
    logWeight(inKg)
    setInputVal('')
  }

  const todayEntry = useMemo(() => {
    const todayStr = new Date().toDateString()
    return entries.find(e => new Date(e.date).toDateString() === todayStr)
  }, [entries])

  const chartData = entries.slice(-30)
  const chartH = 80
  const chartW = 280

  const minW = chartData.length ? Math.min(...chartData.map(e => e.weight)) - 1 : 0
  const maxW = chartData.length ? Math.max(...chartData.map(e => e.weight)) + 1 : 100

  function px(i) { return chartData.length < 2 ? chartW / 2 : (i / (chartData.length - 1)) * chartW }
  function py(w) { return chartH - ((w - minW) / Math.max(maxW - minW, 0.1)) * chartH }

  const path = chartData.map((e, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(e.weight).toFixed(1)}`).join(' ')

  const displayWeight = w => unit === 'lbs' ? (w / 0.453592).toFixed(1) : w
  const displayUnit = unit

  return (
    <div className="flex flex-col gap-4">
      {/* Log today */}
      <div className="bg-[rgba(123,164,196,0.05)] rounded-2xl p-4">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {todayEntry ? "Update Today's Weight" : "Log Today's Weight"}
        </p>
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="number"
              min="1"
              step="0.1"
              placeholder={todayEntry ? displayWeight(todayEntry.weight) : '70.0'}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              className="w-full rounded-xl bg-white dark:bg-gray-700 dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ba4c4]/40"
            />
          </div>
          <div className="flex rounded-xl overflow-hidden bg-[rgba(123,164,196,0.08)] text-xs font-semibold">
            <button onClick={() => setUnit('kg')} className={`px-3 py-2 transition-colors ${unit === 'kg' ? 'bg-[#7ba4c4] text-white' : 'text-[#5a7a96] hover:bg-[rgba(123,164,196,0.1)]'}`}>kg</button>
            <button onClick={() => setUnit('lbs')} className={`px-3 py-2 transition-colors ${unit === 'lbs' ? 'bg-[#7ba4c4] text-white' : 'text-[#5a7a96] hover:bg-[rgba(123,164,196,0.1)]'}`}>lbs</button>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#7ba4c4] text-white rounded-xl text-sm font-semibold hover:bg-[#6b8fae] transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 1 && (
        <div className="bg-[rgba(123,164,196,0.05)] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Weight Over Time</p>
            <span className="text-xs text-[#94a3b8]">{displayUnit}</span>
          </div>
          <svg viewBox={`-10 -5 ${chartW + 20} ${chartH + 15}`} className="w-full">
            {[0, 0.5, 1].map(t => {
              const y = py(minW + t * (maxW - minW))
              const val = minW + t * (maxW - minW)
              return (
                <g key={t}>
                  <line x1="0" y1={y} x2={chartW} y2={y} stroke="rgba(123,164,196,0.12)" strokeWidth="1" />
                  <text x="-5" y={y + 3} fontSize="7" textAnchor="end" fill="#94a3b8">{displayWeight(val)}</text>
                </g>
              )
            })}
            {chartData.length > 1 && (
              <path
                d={`${path} L${px(chartData.length - 1).toFixed(1)},${chartH} L0,${chartH} Z`}
                fill="#7ba4c4" fillOpacity="0.1"
              />
            )}
            {chartData.length > 1 && <path d={path} fill="none" stroke="#7ba4c4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
            {chartData.length > 0 && (
              <circle cx={px(chartData.length - 1)} cy={py(chartData[chartData.length - 1].weight)} r="4" fill="#7ba4c4" stroke="white" strokeWidth="2" />
            )}
          </svg>
          <div className="flex justify-between text-[9px] text-[#94a3b8] mt-1">
            <span>{new Date(chartData[0].date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</span>
            <span>{new Date(chartData[chartData.length - 1].date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      )}

      {/* Recent entries */}
      {entries.length > 0 && (
        <div className="bg-[rgba(123,164,196,0.05)] rounded-2xl p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#94a3b8] mb-3">Recent Entries</p>
          <div className="flex flex-col divide-y divide-[rgba(123,164,196,0.08)]">
            {[...entries].reverse().slice(0, 20).map(e => (
              <div key={e.id} className="flex items-center justify-between py-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(e.date)}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {displayWeight(e.weight)} <span className="text-xs font-normal text-[#94a3b8]">{displayUnit}</span>
                  </span>
                  <button onClick={() => deleteEntry(e.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {entries.length === 0 && (
        <div className="text-center py-8 text-[#94a3b8] text-sm">Log your first weight above</div>
      )}
    </div>
  )
}

// ── Main Progress page ───────────────────────────────────────────────────────
const TABS = [
  { id: 'exercise', label: 'Exercise' },
  { id: 'records', label: 'Records' },
  { id: 'weight', label: 'Body Weight' },
]

export function Progress() {
  const { sessions, setActivePage } = useApp()
  const [tab, setTab] = useState('exercise')

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Progress" />
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full">
        {/* Tab bar */}
        <div className="flex gap-1 bg-[rgba(123,164,196,0.08)] p-1 rounded-xl mb-4">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${tab === t.id ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-[#5a7a96] dark:text-gray-400 hover:text-[#7ba4c4] dark:hover:text-gray-200'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'exercise' && (
          sessions.length === 0
            ? <EmptyState icon="📈" title="No data yet" description="Log some workouts to track your progress over time" action="Log Workout" onAction={() => setActivePage('log')} />
            : <ExerciseTab sessions={sessions} setActivePage={setActivePage} />
        )}
        {tab === 'records' && (
          sessions.length === 0
            ? <EmptyState icon="🏆" title="No records yet" description="Log some workouts to see your personal records" action="Log Workout" onAction={() => setActivePage('log')} />
            : <RecordsTab sessions={sessions} />
        )}
        {tab === 'weight' && <BodyWeightTab />}
      </div>
    </div>
  )
}
