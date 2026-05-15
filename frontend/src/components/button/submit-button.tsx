type Props = {
  children?: React.ReactNode
  disabled?: boolean
}

export default function SubmitButton({ children, disabled }: Props) {
  return (
    <button
      type='submit'
      disabled={disabled}
      className='rounded-lg border bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 disabled:bg-blue-200'
    >
      {children}
    </button>
  )
}
