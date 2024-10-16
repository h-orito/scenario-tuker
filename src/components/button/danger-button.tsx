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
  return (
    <button
      className={`rounded-lg border bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600 disabled:bg-red-200 ${className}`}
      onClick={click}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
