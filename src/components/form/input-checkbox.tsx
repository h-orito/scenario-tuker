type Props = {
  className?: string
  name: string
  label: string
  value: any
  setSelected: (value: any) => void
}

export default function InputCheckbox({
  className,
  name,
  label,
  value,
  setSelected
}: Props) {
  const handleChange = (e: any) => {
    setSelected(e.target.value)
  }

  return (
    <div className={`flex content-center ${className ?? ''}`}>
      <input
        id={name}
        type='checkbox'
        name={name}
        value={value}
        className='relative top-1 h-4 w-4'
        onChange={handleChange}
      />
      <label
        className={`block cursor-pointer rounded border-gray-300 px-2 py-1`}
        htmlFor={name}
      >
        {label}
      </label>
    </div>
  )
}
