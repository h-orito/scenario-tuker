type Props = {
  click?: (e: any) => void
  children: React.ReactNode
  className?: string
}

export default function SecondaryButton({ click, children, className }: Props) {
  return (
    <button
      className={`rounded-lg border bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-600 disabled:bg-gray-200 ${className}`}
      onClick={click}
    >
      {children}
    </button>
  )
}
