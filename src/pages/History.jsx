import { useState, useMemo } from 'react'
import { useApp } from '../store/AppContext'
import { PageHeader } from '../components/layout/PageHeader'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { SessionDetail } from '../components/sessions/SessionDetail'
import { Button } from '../components/ui/Button'
import { TrainingCalendar } from '../components/history/TrainingCalendar'
import { formatDuration } from '../utils/dateHelpers'

function totalVolume(session) {
  let vol = 0
  for (const ex of session.exercises)
    for (const set of ex.sets)
      if (set.weight) vol += (set.reps || 0) * set.weight
  return vol
}

function groupByMonth(sessions) {
  const groups = []
  const map = {}
  sessions.forEach(s => {
    const d = new Date(s.date)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const label = d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    if (!map[key]) { map[key] = { label, sessions: [] }; groups.push(map[key]) }
    map[key].sessions.push(s)
  })
  return groups
}

export function History() {
  const { sessions, deleteSession, setActivePage } = useApp()
  const [selected, setSelected] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const sorted = useMemo(() => [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date)), [sessions])
  const groups = useMemo(() => groupByMonth(sorted), [sorted])

  function handleDelete(session) {
    deleteSession(session.id)
    setSelected(null)
    setConfirmDelete(null)
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="History" />
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full">
        {sorted.length === 0 ? (
          <EmptyState
            icon="📅"
            title="No workouts logged"
            description="Log your first workout to see your history here"
            action="Log Workout"
            onAction={() => setActivePage('log')}
          />
        ) : (
          <div className="flex flex-col gap-4">
            <TrainingCalendar sessions={sessions} />
            {groups.map(group => (
              <div key={group.label}>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#94a3b8] mb-2 px-1">{group.label}</p>
                <div className="bg-[rgba(123,164,196,0.05)] rounded-2xl overflow-hidden divide-y divide-[rgba(123,164,196,0.08)]">
                  {group.sessions.map(s => {
                    const d = new Date(s.date)
                    const day = d.getDate()
                    const weekday = d.toLocaleDateString('en-GB', { weekday: 'short' })
                    const vol = totalVolume(s)
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelected(s)}
                        className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-[rgba(123,164,196,0.06)] transition-colors"
                      >
                        <div className="flex-shrink-0 w-10 text-center">
                          <p className="text-base font-bold text-gray-900 dark:text-white leading-none">{day}</p>
                          <p className="text-[9px] font-semibold text-[#94a3b8] uppercase mt-0.5">{weekday}</p>
                        </div>
                        <div className="w-px self-stretch bg-[rgba(123,164,196,0.15)]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{s.templateName}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {s.exercises.slice(0, 3).map((ex, i) => (
                              <span key={i} className="text-[10px] bg-[rgba(123,164,196,0.1)] text-[#5a7a96] dark:text-gray-300 rounded px-1.5 py-0.5 font-medium">
                                {ex.name}
                              </span>
                            ))}
                            {s.exercises.length > 3 && (
                              <span className="text-[10px] text-[#94a3b8] px-0.5 py-0.5">+{s.exercises.length - 3}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          {s.durationMinutes != null && (
                            <p className="text-xs font-semibold text-[#7ba4c4]">{formatDuration(s.durationMinutes)}</p>
                          )}
                          {vol > 0 && (
                            <p className="text-[10px] text-[#94a3b8] mt-0.5">{vol.toLocaleString()} kg</p>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!selected && !confirmDelete} onClose={() => setSelected(null)} title={selected?.templateName}>
        {selected && (
          <div className="flex flex-col gap-4">
            <SessionDetail session={selected} />
            <Button variant="danger" size="sm" className="self-start" onClick={() => setConfirmDelete(selected)}>
              Delete Session
            </Button>
          </div>
        )}
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => { setConfirmDelete(null); setSelected(null) }} title="Delete Session">
        {confirmDelete && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Delete this session from <strong className="dark:text-white">{confirmDelete.templateName}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => { setConfirmDelete(null); setSelected(null) }}>Cancel</Button>
              <Button variant="danger" className="flex-1" onClick={() => handleDelete(confirmDelete)}>Delete</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
