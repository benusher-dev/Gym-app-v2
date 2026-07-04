export function Card({ children, className = '', onClick }) {
  return (
    <div
      className={`bg-[rgba(123,164,196,0.05)] dark:bg-gray-800 rounded-2xl ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
