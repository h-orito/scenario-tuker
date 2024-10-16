type Props = {
  className?: string
  label: string
  required?: boolean
}

export default function FormLabel({ className, label, required }: Props) {
  return (
    <label className={`block text-sm font-bold text-gray-700 ${className}`}>
      {label}
      {required && <span className='ml-1 text-red-500'>*</span>}
    </label>
  )
}
