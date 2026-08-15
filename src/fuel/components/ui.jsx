export function SectionLabel({ children, muted = false }) {
  return (
    <div className="flex items-center gap-3 mb-2.5 mt-1">
      <span className={muted ? 'lbl-muted' : 'lbl'}>{children}</span>
      <span className="rule" />
    </div>
  )
}

export function Pill({ active, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pill ${active ? 'pill-on' : 'pill-off'} ${className}`}
    >
      {children}
    </button>
  )
}

export function Field({ label, suffix, ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-[13px] text-neutral-600 mb-1">{label}</span>}
      <div className="relative">
        <input className="fld" {...props} />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-neutral-400">
            {suffix}
          </span>
        )}
      </div>
    </label>
  )
}

export function Stat({ value, unit, label, tone = 'dark' }) {
  const color = tone === 'brand' ? 'text-steel-600' : 'text-neutral-900'
  return (
    <div>
      <p className={`font-display text-2xl font-bold leading-none ${color}`}>
        {value}
        {unit && <span className="text-[13px] font-body font-medium text-neutral-400 ml-0.5">{unit}</span>}
      </p>
      <p className="lbl-muted mt-1.5">{label}</p>
    </div>
  )
}

export function Panel({ children, className = '' }) {
  return (
    <div className={`rounded-xl bg-[rgba(123,164,196,0.05)] p-4 ${className}`}>
      {children}
    </div>
  )
}

export function Hex({ className = 'h-8 w-8' }) {
  return (
    <svg className={className} viewBox="0 0 40 44" fill="none" aria-hidden="true">
      <path
        d="M20 1.5 37.5 11.5v21L20 42.5 2.5 32.5v-21L20 1.5Z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      <path d="M21.5 12 14 24h5.5l-1 8L27 20h-5.5l1-8Z" fill="currentColor" />
    </svg>
  )
}
