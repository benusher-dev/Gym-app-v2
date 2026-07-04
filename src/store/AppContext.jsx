import { createContext, useContext, useState } from 'react'
import { useTemplates } from '../hooks/useTemplates'
import { useSessions } from '../hooks/useSessions'
import { useDarkMode } from '../hooks/useDarkMode'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useTemplates()
  const { sessions, addSession, deleteSession } = useSessions()
  const { isDark, toggleDark } = useDarkMode()
  const [activePage, setActivePage] = useState('dashboard')
  const [logTemplateId, setLogTemplateId] = useState(null)
  const [progressExercise, setProgressExercise] = useState('')
  const [workoutStep, setWorkoutStep] = useState(1)

  return (
    <AppContext.Provider
      value={{
        templates, addTemplate, updateTemplate, deleteTemplate,
        sessions, addSession, deleteSession,
        isDark, toggleDark,
        activePage, setActivePage,
        logTemplateId, setLogTemplateId,
        progressExercise, setProgressExercise,
        workoutStep, setWorkoutStep,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
