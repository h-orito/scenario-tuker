type Props = {
  click?: (e: any) => void
  disabled?: boolean
  children?: React.ReactNode
  className?: string
}

export default function PrimaryButton({
  click,
  disabled,
  children,
  className
}: Props) {
  const xClass = className && className.includes('px') ? '' : 'px-4'
  const yClass = className && className.includes('py') ? '' : 'py-2'
  return (
    <button
      className={`rounded-lg border bg-blue-500 ${xClass} ${yClass} font-bold text-white hover:bg-blue-600 disabled:bg-blue-200 ${className ?? ''}`}
      onClick={click}
      disabled={disabled}
    >
      {children && children}
    </button>
  )
}
