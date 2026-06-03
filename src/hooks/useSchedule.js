import { useLocalStorage } from './useLocalStorage'

export const SCHEDULE_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
export const DAY_LABELS = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' }
export const DAY_FULL = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' }

export function todayKey() {
  return SCHEDULE_DAYS[(new Date().getDay() + 6) % 7]
}

// Normalize old single-value entries to arrays
export function normaliseDayTemplates(value) {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

export function useSchedule() {
  const [schedule, setSchedule] = useLocalStorage('gwt_schedule', {})

  function getDayTemplates(day) {
    return normaliseDayTemplates(schedule[day])
  }

  function setDayTemplates(day, ids) {
    setSchedule(prev => ({ ...prev, [day]: ids.length ? ids : null }))
  }

  return { schedule, getDayTemplates, setDayTemplates }
}
