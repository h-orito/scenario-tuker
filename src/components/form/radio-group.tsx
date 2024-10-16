import { useMemo } from 'react'

type Props = {
  className?: string
  name: string
  candidates: Array<Option>
  selected: any
  setSelected: (value: any) => void
  disabled?: boolean
}

type Option = {
  label: string
  value: any
}

export default function RadioGroup({
  className,
  name,
  candidates,
  selected,
  setSelected,
  disabled
}: Props) {
  return (
    <div className={`flex ${className ?? ''}`}>
      {candidates.map((candidate, index) => {
        const roundClass =
          index === 0
            ? 'rounded-l border-l'
            : index === candidates.length - 1
              ? 'rounded-r border-r'
              : 'border'
        const checkedClass =
          selected === candidate.value ? 'bg-blue-500 text-white' : 'bg-white'
        return (
          <div key={index} className='flex'>
            <input
              type='radio'
              name={name}
              className='h-0 w-0 opacity-0'
              value={candidate.value}
              id={`${name}_${index}`}
              checked={selected === candidate.value}
              onChange={(e: any) => setSelected(e.target.value)}
              disabled={disabled}
            />
            <label
              className={`block cursor-pointer border-y border-gray-300 px-2 py-1 ${checkedClass} ${roundClass}`}
              htmlFor={`${name}_${index}`}
            >
              {candidate.label}
            </label>
          </div>
        )
      })}
    </div>
  )
}
