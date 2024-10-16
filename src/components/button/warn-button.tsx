type Props = {
  className?: string
  click: (e: any) => void
  children: React.ReactNode
}

export default function WarnButton({ className, click, children }: Props) {
  return (
    <button
      className={`rounded-lg border bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600 disabled:bg-orange-200 ${className}`}
      onClick={click}
    >
      {children}
    </button>
  )
}
