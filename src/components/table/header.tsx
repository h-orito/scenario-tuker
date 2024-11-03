import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Column, SortDirection } from '@tanstack/react-table'
import { useEffect, useState } from 'react'

export const getSortIcon = (
  sortDirection: false | SortDirection
): JSX.Element => {
  switch (sortDirection) {
    case 'asc':
      return <FontAwesomeIcon icon={faSortUp} className='h-3' />
    case 'desc':
      return <FontAwesomeIcon icon={faSortDown} className='h-3' />
    default:
      return <FontAwesomeIcon icon={faSort} className='h-3' />
  }
}

export const Filter = ({
  column,
  disabled
}: {
  column: Column<any, unknown>
  disabled?: boolean
}) => {
  const columnFilterValue = column.getFilterValue()

  return (
    <DebouncedInput
      className='w-full rounded border border-gray-300 px-2 py-1 text-gray-700 mt-1 font-normal'
      name={column.id}
      value={(columnFilterValue ?? '') as string}
      onChange={(value) => {
        column.setFilterValue(value)
      }}
      placeholder='検索'
      disabled={disabled}
    />
  )
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 300,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
