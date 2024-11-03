type Props = {
  className?: string
  click: (e: any) => void
  children: React.ReactNode
  disabled?: boolean
}

export default function WarnButton({
  className,
  click,
  children,
  disabled
}: Props) {
  const xClass = className && className.includes('px') ? '' : 'px-4'
  const yClass = className && className.includes('py') ? '' : 'py-2'

  return (
    <button
      className={`rounded-lg border bg-yellow-500 ${xClass} ${yClass} font-bold text-white hover:bg-yellow-600 disabled:bg-yellow-200 ${className}`}
      onClick={click}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
