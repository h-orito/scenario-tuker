type Props = {
  children: React.ReactNode
  className?: string
}

const NormalNotification = ({ children, className }: Props) => {
  return (
    <div className={`bg-gray-200 rounded p-4 ${className ?? ''}`}>
      {children}
    </div>
  )
}
export default NormalNotification
