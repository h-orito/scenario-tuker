type Props = {
  click: (e: any) => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export default function DangerButton({
  click,
  children,
  className,
  disabled
}: Props) {
  const xClass = className && className.includes('px') ? '' : 'px-4'
  const yClass = className && className.includes('py') ? '' : 'py-2'
  return (
    <button
      className={`rounded-lg border bg-red-500 ${xClass} ${yClass} font-bold text-white hover:bg-red-600 disabled:bg-red-200 ${className}`}
      onClick={click}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
