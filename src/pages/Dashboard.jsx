import { useMemo, useState, useRef, useEffect } from 'react'
import { useApp } from '../store/AppContext'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/Button'
import { SessionCard } from '../components/sessions/SessionCard'
import { useSchedule, SCHEDULE_DAYS, DAY_LABELS, DAY_FULL, todayKey, normaliseDayTemplates } from '../hooks/useSchedule'
import { useBodyWeight } from '../hooks/useBodyWeight'

// ── Streak helpers ───────────────────────────────────────────────────────────
function calcStreak(sessions) {
  if (!sessions.length) return 0
  const daySet = new Set(sessions.map(s => new Date(s.date).toDateString()))
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)

  // Walk backwards from today; streak starts only if trained today or yesterday
  let check = new Date(today)
  if (!daySet.has(today.toDateString())) {
    if (!daySet.has(yesterday.toDateString())) return 0
    check = new Date(yesterday)
  }

  let streak = 0
  while (daySet.has(check.toDateString())) {
    streak++
    check.setDate(check.getDate() - 1)
  }
  return streak
}

// ── Export / import helpers ──────────────────────────────────────────────────
const STORAGE_KEYS = ['gwt_templates', 'gwt_sessions', 'gwt_custom_exercises', 'gwt_schedule', 'gwt_bodyweight']

function exportData() {
  const data = {}
  STORAGE_KEYS.forEach(k => { const v = localStorage.getItem(k); if (v) data[k] = JSON.parse(v) })
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `gymtracker-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function readBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      try { resolve(JSON.parse(e.target.result)) }
      catch { reject(new Error('Invalid backup file')) }
    }
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsText(file)
  })
}

function mergeImport(data) {
  const getLocal = k => { try { return JSON.parse(localStorage.getItem(k) ?? 'null') } catch { return null } }

  // Sessions — merge by id
  if (Array.isArray(data.gwt_sessions)) {
    const current = getLocal('gwt_sessions') ?? []
    const existingIds = new Set(current.map(s => s.id))
    const merged = [...current, ...data.gwt_sessions.filter(s => !existingIds.has(s.id))]
    localStorage.setItem('gwt_sessions', JSON.stringify(merged))
  }

  // Body weight — merge by date string
  if (Array.isArray(data.gwt_bodyweight)) {
    const current = getLocal('gwt_bodyweight') ?? []
    const existingDates = new Set(current.map(e => e.date))
    const merged = [...current, ...data.gwt_bodyweight.filter(e => !existingDates.has(e.date))]
    localStorage.setItem('gwt_bodyweight', JSON.stringify(merged))
  }

  // Templates — merge by id (never overwrite current templates)
  if (Array.isArray(data.gwt_templates)) {
    const current = getLocal('gwt_templates') ?? []
    const existingIds = new Set(current.map(t => t.id))
    const merged = [...current, ...data.gwt_templates.filter(t => !existingIds.has(t.id))]
    localStorage.setItem('gwt_templates', JSON.stringify(merged))
  }

  // Custom exercises — merge by id
  if (Array.isArray(data.gwt_custom_exercises)) {
    const current = getLocal('gwt_custom_exercises') ?? []
    const existingIds = new Set(current.map(e => e.id))
    const merged = [...current, ...data.gwt_custom_exercises.filter(e => !existingIds.has(e.id))]
    localStorage.setItem('gwt_custom_exercises', JSON.stringify(merged))
  }

  // Schedule — skip (keep current)
}

function previewMerge(data) {
  const getLocal = k => { try { return JSON.parse(localStorage.getItem(k) ?? 'null') } catch { return null } }
  const count = (local, incoming, key) => {
    if (!Array.isArray(incoming)) return 0
    const existing = new Set((local ?? []).map(x => x[key]))
    return incoming.filter(x => !existing.has(x[key])).length
  }
  return {
    sessions:   count(getLocal('gwt_sessions') ?? [],         data.gwt_sessions,         'id'),
    bodyweight: count(getLocal('gwt_bodyweight') ?? [],       data.gwt_bodyweight,       'date'),
    templates:  count(getLocal('gwt_templates') ?? [],        data.gwt_templates,        'id'),
    exercises:  count(getLocal('gwt_custom_exercises') ?? [], data.gwt_custom_exercises, 'id'),
  }
}

// ── Import preview sheet ─────────────────────────────────────────────────────
function ImportPreviewSheet({ preview, onConfirm, onCancel }) {
  const rows = [
    { label: 'Workout sessions',  count: preview.sessions },
    { label: 'Body weight logs',  count: preview.bodyweight },
    { label: 'New templates',     count: preview.templates },
    { label: 'Custom exercises',  count: preview.exercises },
  ].filter(r => r.count > 0)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-lg"
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1 bg-gray-200 dark:bg-gray-600 rounded-full" />
        </div>
        <div className="px-5 pt-3 pb-4">
          <p className="text-base font-bold text-gray-900 dark:text-white mb-1">Merge Import</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            New data from the backup will be added alongside your current data. Nothing will be overwritten.
          </p>
          {rows.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Nothing new to import — your data is already up to date.</p>
          ) : (
            <div className="flex flex-col gap-2 mb-4">
              {rows.map(r => (
                <div key={r.label} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-2.5">
                  <span className="text-sm text-gray-700 dark:text-gray-200">{r.label}</span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-amber-400">+{r.count}</span>
                </div>
              ))}
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 px-1">
                Your schedule and existing templates won't be changed.
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={rows.length === 0}
              className="flex-1 py-3 rounded-xl text-sm font-bold bg-indigo-600 dark:bg-amber-600 text-white disabled:opacity-40"
            >
              Merge &amp; Reload
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Day assign sheet ─────────────────────────────────────────────────────────
function AssignSheet({ day, templates, current, onAssign, onClose }) {
  const [selected, setSelected] = useState(current) // current is always an array

  function toggle(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function handleDone() { onAssign(selected); onClose() }
  function handleRest() { onAssign([]); onClose() }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-lg"
        style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="w-10 h-1 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">{DAY_FULL[day]}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Tap to select — stack multiple workouts</p>
            </div>
            <button onClick={handleDone} className="px-4 py-1.5 bg-indigo-600 dark:bg-amber-600 text-white text-sm font-semibold rounded-xl">Done</button>
          </div>
        </div>
        <div className="overflow-y-auto max-h-96">
          <button
            onClick={handleRest}
            className={`w-full text-left px-5 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!selected.length ? 'text-indigo-600 dark:text-amber-500' : 'text-gray-500 dark:text-gray-400'}`}
          >
            <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm">😴</div>
            <span className="text-sm font-medium dark:text-gray-200">Rest Day</span>
            {!selected.length && <svg className="h-4 w-4 ml-auto text-indigo-500 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>}
          </button>
          {templates.map(t => {
            const isSelected = selected.includes(t.id)
            return (
              <button
                key={t.id}
                onClick={() => toggle(t.id)}
                className={`w-full text-left px-5 py-3 flex items-center gap-3 hover:bg-indigo-50 dark:hover:bg-amber-900/30 transition-colors ${isSelected ? 'text-indigo-600 dark:text-amber-500' : 'text-gray-800 dark:text-gray-200'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-indigo-600 dark:bg-amber-600' : 'bg-indigo-100 dark:bg-amber-900/40'}`}>
                  {isSelected
                    ? <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    : <svg className="h-4 w-4 text-indigo-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" /></svg>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.exercises.length} exercise{t.exercises.length !== 1 ? 's' : ''}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Body weight card ─────────────────────────────────────────────────────────
function BodyWeightCard({ onNavigate }) {
  const { entries, logWeight } = useBodyWeight()
  const [input, setInput] = useState('')

  const latest = entries.length > 0 ? entries[entries.length - 1] : null
  const prev   = entries.length > 1 ? entries[entries.length - 2] : null
  const diff   = latest && prev ? +(latest.weight - prev.weight).toFixed(1) : null

  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30)
  const chartData = entries.filter(e => new Date(e.date) >= cutoff)
  const trend = chartData.length >= 2
    ? +(chartData[chartData.length - 1].weight - chartData[0].weight).toFixed(1)
    : null

  const todayLogged = entries.some(e => new Date(e.date).toDateString() === new Date().toDateString())

  function handleLog() {
    const w = parseFloat(input)
    if (!w || w <= 0 || w > 500) return
    logWeight(w)
    setInput('')
  }

  let sparkline = null
  if (chartData.length >= 2) {
    const W = 300, H = 60, pad = 4
    const weights = chartData.map(d => d.weight)
    const minW = Math.min(...weights)
    const maxW = Math.max(...weights)
    const range = maxW - minW || 1
    const pts = chartData.map((d, i) => [
      pad + (i / (chartData.length - 1)) * (W - pad * 2),
      pad + (1 - (d.weight - minW) / range) * (H - pad * 2),
    ])
    const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
    const areaPath = `${linePath} L${pts[pts.length - 1][0].toFixed(1)},${H} L${pts[0][0].toFixed(1)},${H} Z`
    sparkline = { linePath, areaPath, lastPt: pts[pts.length - 1], W, H }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onNavigate} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <span className="text-base">⚖️</span>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Body Weight</p>
          <svg className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
        {trend !== null && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trend < 0 ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
            : trend > 0 ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
          }`}>
            {trend > 0 ? '+' : ''}{trend} kg / 30d
          </span>
        )}
      </div>

      {/* Current weight + change */}
      {latest ? (
        <div className="mb-3">
          <div className="flex items-center gap-4">
            {/* Current */}
            <div>
              <p className="text-4xl font-bold text-gray-900 dark:text-white leading-none">
                {latest.weight}
                <span className="text-lg font-medium text-gray-400 ml-1">kg</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {new Date(latest.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </p>
            </div>

            {diff !== null && (
              <>
                {/* Arrow */}
                <div className={diff < 0 ? 'text-emerald-500' : diff > 0 ? 'text-rose-500' : 'text-gray-400'}>
                  {diff < 0 ? (
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="18 15 12 9 6 15" /></svg>
                  ) : diff > 0 ? (
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
                  ) : (
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  )}
                </div>

                {/* Previous weight */}
                <div className="border-l border-gray-100 dark:border-gray-700 pl-4">
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-0.5">Previous</p>
                  <p className="text-xl font-bold text-gray-400 dark:text-gray-500 leading-none">
                    {prev.weight}
                    <span className="text-sm font-medium ml-1">kg</span>
                  </p>
                  <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">
                    {new Date(prev.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Change badge */}
          {diff !== null && (
            <div className={`inline-flex items-center gap-1.5 mt-2.5 px-3 py-1.5 rounded-xl text-sm font-semibold ${
              diff < 0
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                : diff > 0
                ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              {diff < 0 ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="18 15 12 9 6 15" /></svg>
              ) : diff > 0 ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
              ) : null}
              {diff === 0
                ? 'No change'
                : diff < 0
                ? `Decreased by ${Math.abs(diff)} kg`
                : `Increased by ${diff} kg`}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">No entries yet — log your first weight below</p>
      )}

      {/* Sparkline */}
      {sparkline && (
        <div className="mb-3 -mx-1">
          <svg viewBox={`0 0 ${sparkline.W} ${sparkline.H}`} className="w-full" style={{ height: 60 }} preserveAspectRatio="none">
            <defs>
              <linearGradient id="bwGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={sparkline.areaPath} fill="url(#bwGrad)" />
            <path d={sparkline.linePath} fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={sparkline.lastPt[0]} cy={sparkline.lastPt[1]} r="3.5" fill="#0ea5e9" />
          </svg>
        </div>
      )}

      {/* Quick log */}
      <div className="flex gap-2">
        <input
          type="number" min="20" max="500" step="0.1"
          placeholder={todayLogged ? `Update (${latest?.weight} kg)` : "Today's weight (kg)"}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLog()}
          className="flex-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-amber-500"
        />
        <button
          onClick={handleLog}
          disabled={!input}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-sky-500 dark:bg-amber-600 text-white hover:bg-sky-600 dark:hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Log
        </button>
      </div>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
function weekStart() {
  const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); d.setHours(0, 0, 0, 0); return d
}
function monthStart() {
  const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d
}

function dateToKey(date) {
  return SCHEDULE_DAYS[(date.getDay() + 6) % 7]
}

function generateDates(daysBack = 7, daysForward = 28) {
  const base = new Date(); base.setHours(0, 0, 0, 0)
  return Array.from({ length: daysBack + daysForward + 1 }, (_, i) => {
    const d = new Date(base)
    d.setDate(base.getDate() - daysBack + i)
    return d
  })
}

function ScheduleStrip({ schedule, templates, today, onAssignDay }) {
  const dates = useMemo(() => generateDates(7, 28), [])
  const scrollRef = useRef(null)
  const todayRef = useRef(null)

  useEffect(() => {
    if (todayRef.current && scrollRef.current) {
      const container = scrollRef.current
      const el = todayRef.current
      container.scrollLeft = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2
    }
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">Schedule</p>
        <p className="text-xs text-gray-400">Tap to assign</p>
      </div>
      <div ref={scrollRef} className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {dates.map((date, idx) => {
          const dayKey = dateToKey(date)
          const dayIds = normaliseDayTemplates(schedule[dayKey])
          const dayTmpls = dayIds.map(id => templates.find(t => t.id === id)).filter(Boolean)
          const hasTmpls = dayTmpls.length > 0
          const isToday = dayKey === today && date.toDateString() === new Date().toDateString()
          const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))
          return (
            <button
              key={idx}
              ref={isToday ? todayRef : null}
              onClick={() => onAssignDay(dayKey)}
              className={`flex-shrink-0 flex flex-col items-center gap-1 py-2 px-2 rounded-xl transition-colors w-12 ${
                isToday
                  ? hasTmpls ? 'bg-indigo-600 dark:bg-amber-600 text-white' : 'bg-indigo-50 dark:bg-amber-900/30 border-2 border-indigo-300 dark:border-amber-600 text-indigo-600 dark:text-amber-400'
                  : isPast
                  ? 'opacity-40 ' + (hasTmpls ? 'bg-gray-100 dark:bg-gray-700 text-gray-500' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 border border-dashed border-gray-200 dark:border-gray-600')
                  : hasTmpls ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-amber-900/30' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-dashed border-gray-200 dark:border-gray-600'
              }`}
            >
              <span className="text-[10px] font-bold uppercase">{DAY_LABELS[dayKey]}</span>
              <span className={`text-[10px] font-medium ${isToday ? 'text-white/70' : 'text-gray-400 dark:text-gray-500'}`}>
                {date.getDate()}
              </span>
              {hasTmpls ? (
                <div className="relative w-6 h-6">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isToday ? 'bg-white/20' : 'bg-indigo-100 dark:bg-amber-900/40'}`}>
                    <svg className={`h-3.5 w-3.5 ${isToday ? 'text-white' : 'text-indigo-600 dark:text-amber-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
                    </svg>
                  </div>
                  {dayTmpls.length > 1 && (
                    <span className={`absolute -top-1 -right-1 text-[7px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center ${isToday ? 'bg-white text-indigo-600 dark:text-amber-700' : 'bg-indigo-500 dark:bg-amber-500 text-white'}`}>
                      {dayTmpls.length}
                    </span>
                  )}
                </div>
              ) : (
                <div className="w-6 h-6 rounded-lg flex items-center justify-center">
                  <span className="text-xs">—</span>
                </div>
              )}
              {hasTmpls && (
                <span className={`text-[8px] font-medium leading-tight text-center w-full truncate px-0.5 ${isToday ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                  {dayTmpls.length > 1 ? `${dayTmpls.length} workouts` : dayTmpls[0].name}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function Dashboard() {
  const { sessions, setActivePage, setLogTemplateId, templates } = useApp()
  const { schedule, getDayTemplates, setDayTemplates } = useSchedule()
  const [assignDay, setAssignDay] = useState(null)
  const [importPreview, setImportPreview] = useState(null)
  const [pendingImportData, setPendingImportData] = useState(null)
  const importRef = useRef(null)
  const today = todayKey()

  const recentSessions = useMemo(
    () => [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3),
    [sessions]
  )

  const { stats, streak } = useMemo(() => {
    const ws = weekStart(); const ms = monthStart()
    const thisWeek = sessions.filter(s => new Date(s.date) >= ws)
    const thisMonth = sessions.filter(s => new Date(s.date) >= ms)
    const uniqueDays = new Set(thisMonth.map(s => new Date(s.date).toDateString())).size
    return {
      stats: { total: sessions.length, weekSessions: thisWeek.length, monthDays: uniqueDays },
      streak: calcStreak(sessions),
    }
  }, [sessions])

  const todayTemplates = getDayTemplates(today).map(id => templates.find(t => t.id === id)).filter(Boolean)

  function startTemplate(id) {
    setLogTemplateId(id)
    setActivePage('log')
  }

  function startToday() {
    if (todayTemplates.length) { setLogTemplateId(todayTemplates[0].id) }
    setActivePage('log')
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="GymTracker" />
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full">
        <div className="flex flex-col gap-5">

          {/* Today hero */}
          <div className={`rounded-2xl p-5 shadow-lg text-white ${todayTemplates.length ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-amber-600 dark:to-orange-700' : 'bg-gradient-to-br from-gray-700 to-gray-800'}`}>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">Today</p>
            {todayTemplates.length > 0 ? (
              todayTemplates.length === 1 ? (
                <>
                  <h2 className="text-xl font-bold mb-1">{todayTemplates[0].name}</h2>
                  <p className="text-sm opacity-70 mb-4">{todayTemplates[0].exercises.length} exercise{todayTemplates[0].exercises.length !== 1 ? 's' : ''}</p>
                  <Button variant="secondary" className="bg-white text-indigo-600 dark:text-amber-700 border-0 hover:bg-indigo-50" onClick={startToday}>
                    Start Workout
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-1">{todayTemplates.length} Workouts Stacked</h2>
                  <p className="text-sm opacity-70 mb-3">Choose one to start</p>
                  <div className="flex flex-col gap-2">
                    {todayTemplates.map(t => (
                      <button
                        key={t.id}
                        onClick={() => startTemplate(t.id)}
                        className="w-full text-left bg-white/20 hover:bg-white/30 rounded-xl px-4 py-2.5 transition-colors"
                      >
                        <p className="text-sm font-semibold text-white">{t.name}</p>
                        <p className="text-xs text-white/70">{t.exercises.length} exercise{t.exercises.length !== 1 ? 's' : ''}</p>
                      </button>
                    ))}
                  </div>
                </>
              )
            ) : (
              <>
                <h2 className="text-xl font-bold mb-1">Rest Day</h2>
                <p className="text-sm opacity-60 mb-4">No workout scheduled</p>
                <div className="flex gap-2">
                  <Button variant="secondary" className="bg-white/20 text-white border-0 hover:bg-white/30 text-sm" onClick={() => setAssignDay(today)}>
                    Schedule Workout
                  </Button>
                  {templates.length > 0 && (
                    <Button variant="secondary" className="bg-white text-gray-800 border-0 hover:bg-gray-100 text-sm" onClick={startToday}>
                      Log Anyway
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Schedule strip */}
          <ScheduleStrip
            schedule={schedule}
            templates={templates}
            today={today}
            onAssignDay={setAssignDay}
          />

          {/* Stats row */}
          {sessions.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: stats.total, label: 'Total' },
                { value: stats.weekSessions, label: 'This week' },
                { value: stats.monthDays, label: 'Days / mo' },
                { value: streak, label: 'Day streak', suffix: streak > 0 ? '🔥' : '' },
              ].map(({ value, label, suffix }) => (
                <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                  <p className="text-xl font-bold text-indigo-600 dark:text-amber-400">
                    {value}{suffix && <span className="text-base ml-0.5">{suffix}</span>}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Body weight */}
          <BodyWeightCard onNavigate={() => setActivePage('bodyweight')} />

          {/* Recent sessions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Recent Workouts</p>
              {sessions.length > 3 && (
                <button onClick={() => setActivePage('history')} className="text-xs text-indigo-600 dark:text-amber-400 font-medium hover:underline">
                  View all
                </button>
              )}
            </div>
            {recentSessions.length === 0 ? (
              <div className="py-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                <p className="text-sm text-gray-400">No workouts yet</p>
                <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">Log your first workout to see it here</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recentSessions.map(s => <SessionCard key={s.id} session={s} onClick={() => setActivePage('history')} />)}
              </div>
            )}
          </div>

          {/* Backup / restore */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Data Backup</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Export your workouts, sessions, and settings as a JSON file, or restore from a previous backup.</p>
            <div className="flex gap-2">
              <button
                onClick={exportData}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-indigo-600 dark:bg-amber-600 text-white hover:bg-indigo-700 dark:hover:bg-amber-700 transition-colors"
              >
                Export Backup
              </button>
              <button
                onClick={() => importRef.current?.click()}
                className="flex-1 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Restore Backup
              </button>
              <input
                ref={importRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={async e => {
                  const file = e.target.files?.[0]
                  e.target.value = ''
                  if (!file) return
                  try {
                    const data = await readBackupFile(file)
                    setPendingImportData(data)
                    setImportPreview(previewMerge(data))
                  } catch {
                    alert('Invalid backup file — could not read data.')
                  }
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {assignDay && (
        <AssignSheet
          day={assignDay}
          templates={templates}
          current={getDayTemplates(assignDay)}
          onAssign={ids => setDayTemplates(assignDay, ids)}
          onClose={() => setAssignDay(null)}
        />
      )}
      {importPreview && (
        <ImportPreviewSheet
          preview={importPreview}
          onConfirm={() => {
            mergeImport(pendingImportData)
            setImportPreview(null)
            setPendingImportData(null)
            window.location.reload()
          }}
          onCancel={() => {
            setImportPreview(null)
            setPendingImportData(null)
          }}
        />
      )}
    </div>
  )
}
