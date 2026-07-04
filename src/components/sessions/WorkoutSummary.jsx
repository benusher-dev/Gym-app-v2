import { useMemo } from 'react'
import { formatDuration } from '../../utils/dateHelpers'
import { MuscleDiagram } from './MuscleDiagram'
import { Button } from '../ui/Button'

function totalVol(session) {
  let v = 0
  for (const ex of session.exercises)
    for (const s of ex.sets)
      if (s.weight && s.reps) v += s.reps * s.weight
  return v
}

function calcStats(exercises) {
  const maxWeight = sets => sets.length ? Math.max(0, ...sets.map(s => s.weight || 0)) : 0
  const totalReps = sets => sets.reduce((sum, s) => sum + (s.reps || 0), 0)
  return exercises.map(ex => ({ name: ex.name, exerciseId: ex.exerciseId, maxWeight: maxWeight(ex.sets), totalReps: totalReps(ex.sets) }))
}

function Delta({ value, unit }) {
  if (value === 0) return <span className="text-xs text-[#94a3b8]">= {unit}</span>
  if (value > 0) return <span className="text-xs font-semibold text-emerald-600">↑ +{value} {unit}</span>
  return <span className="text-xs font-medium text-red-500">↓ {value} {unit}</span>
}

function buildHistoricalMaxes(historicalSessions) {
  const map = {}
  historicalSessions.forEach(s => {
    s.exercises.forEach(ex => {
      if (!map[ex.name]) map[ex.name] = { maxWeight: 0, maxReps: 0 }
      ex.sets.forEach(set => {
        if ((set.weight || 0) > map[ex.name].maxWeight) map[ex.name].maxWeight = set.weight || 0
        if ((set.reps || 0) > map[ex.name].maxReps) map[ex.name].maxReps = set.reps || 0
      })
    })
  })
  return map
}

export function WorkoutSummary({ session, previousSession, historicalSessions, onDone }) {
  const currStats = calcStats(session.exercises)
  const currVolume = totalVol(session)
  const prevVolume = previousSession ? totalVol(previousSession) : 0
  const volDelta = prevVolume > 0 ? Math.round(currVolume - prevVolume) : 0

  const prevLookup = {}
  if (previousSession) {
    for (const ex of previousSession.exercises) {
      prevLookup[ex.exerciseId] = ex
      prevLookup[ex.name] = ex
    }
  }

  const historicalMaxes = useMemo(() => buildHistoricalMaxes(historicalSessions ?? []), [historicalSessions])

  const newPRs = useMemo(() => {
    const prs = new Set()
    currStats.forEach(curr => {
      const hist = historicalMaxes[curr.name]
      if (!hist) return
      if (curr.maxWeight > 0 && curr.maxWeight > hist.maxWeight) prs.add(`${curr.name}_weight`)
      if (curr.totalReps > 0 && curr.totalReps > hist.maxReps) prs.add(`${curr.name}_reps`)
    })
    return prs
  }, [currStats, historicalMaxes])

  const hasPRs = newPRs.size > 0

  return (
    <div className="flex flex-col gap-5">
      {/* Steel header card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #7ba4c4 0%, #5a7a96 100%)' }}>
        <div className="px-5 pt-5 pb-5">
          <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-white/60 mb-1">Workout Complete</p>
          <h2 className="text-xl font-bold text-white leading-tight">{session.templateName}</h2>
          <div className="flex items-end gap-5 mt-3">
            {session.durationMinutes != null && (
              <div>
                <p className="text-2xl font-bold text-white tabular-nums leading-none">{formatDuration(session.durationMinutes)}</p>
                <p className="text-[9px] text-white/55 font-bold uppercase tracking-[0.1em] mt-1">Duration</p>
              </div>
            )}
            {currVolume > 0 && (
              <div>
                <p className="text-2xl font-bold text-white tabular-nums leading-none">
                  {currVolume.toLocaleString()}<span className="text-sm font-normal text-white/60 ml-0.5">kg</span>
                </p>
                <p className="text-[9px] text-white/55 font-bold uppercase tracking-[0.1em] mt-1">Volume</p>
              </div>
            )}
            {prevVolume > 0 && volDelta !== 0 && (
              <div>
                <p className={`text-2xl font-bold tabular-nums leading-none ${volDelta > 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                  {volDelta > 0 ? '+' : ''}{volDelta.toLocaleString()}<span className="text-sm font-normal ml-0.5 opacity-70">kg</span>
                </p>
                <p className="text-[9px] text-white/55 font-bold uppercase tracking-[0.1em] mt-1">vs last</p>
              </div>
            )}
          </div>
          {hasPRs && (
            <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/30 text-amber-200 px-3 py-1.5 rounded-full text-xs font-bold">
              ★ {newPRs.size} personal record{newPRs.size > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Performance */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#94a3b8] mb-2">Performance</p>
        <div className="flex flex-col gap-2">
          {currStats.map((curr, i) => {
            const prev = prevLookup[curr.exerciseId] || prevLookup[curr.name]
            const isNew = !prev
            const prWeight = newPRs.has(`${curr.name}_weight`)
            const prReps = newPRs.has(`${curr.name}_reps`)

            if (isNew) {
              return (
                <div key={i} className="bg-[rgba(123,164,196,0.05)] rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{curr.name}</span>
                  <span className="text-xs bg-[rgba(123,164,196,0.12)] text-[#5a7a96] font-semibold px-2 py-0.5 rounded-full">First time!</span>
                </div>
              )
            }

            const prevStats = calcStats([prev])[0]
            const weightDelta = curr.maxWeight - prevStats.maxWeight
            const repsDelta = curr.totalReps - prevStats.totalReps

            return (
              <div key={i} className={`rounded-xl p-3 ${prWeight || prReps ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800' : 'bg-[rgba(123,164,196,0.05)]'}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{curr.name}</p>
                  {(prWeight || prReps) && <span className="text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded-full">PR</span>}
                </div>
                <div className="flex gap-4">
                  {curr.maxWeight > 0 && (
                    <div>
                      <p className="text-[9px] text-[#94a3b8] uppercase tracking-wide font-bold mb-0.5">Max weight</p>
                      <Delta value={weightDelta} unit="kg" />
                    </div>
                  )}
                  <div>
                    <p className="text-[9px] text-[#94a3b8] uppercase tracking-wide font-bold mb-0.5">Total reps</p>
                    <Delta value={repsDelta} unit="reps" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Muscles */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#94a3b8] mb-2">Muscles Trained</p>
        <div className="bg-[rgba(123,164,196,0.05)] rounded-2xl p-4">
          <MuscleDiagram exercises={session.exercises} />
        </div>
      </div>

      <Button size="lg" className="w-full" onClick={onDone}>Done</Button>
    </div>
  )
}
