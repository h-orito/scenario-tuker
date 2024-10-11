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
  return (
    <button
      className={`${className ?? ''} rounded-sm border bg-blue-500 px-4 py-1 text-white hover:bg-blue-600 disabled:bg-blue-200`}
      onClick={click}
      disabled={disabled}
    >
      {children && children}
    </button>
  )
}
