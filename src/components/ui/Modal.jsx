import { useEffect } from 'react'

let lockCount = 0

export function Modal({ open, onClose, title, children, fullScreen = false }) {
  useEffect(() => {
    if (!open) return
    lockCount++
    document.body.style.overflow = 'hidden'
    return () => {
      lockCount--
      if (lockCount === 0) document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative bg-white dark:bg-gray-800 w-full shadow-2xl z-10 flex flex-col ${
          fullScreen
            // dvh, not vh — on iOS vh measures the viewport with the address bar
            // hidden, so a vh-sized sheet runs off the bottom of the real screen.
            ? 'h-dvh rounded-none'
            : 'max-h-[90dvh] rounded-t-3xl sm:rounded-3xl sm:max-w-lg sm:mx-4'
        }`}
        style={fullScreen ? { paddingTop: 'env(safe-area-inset-top)' } : undefined}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            // 40px hit area — p-1 around a 20px icon left a 28px target, below
            // the size a thumb reliably hits.
            className="-mr-2 h-10 w-10 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div
          className="overflow-y-auto flex-1 px-5 py-4"
          // The sheet is bottom-anchored, so without this its last row sits
          // under the home indicator.
          style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
