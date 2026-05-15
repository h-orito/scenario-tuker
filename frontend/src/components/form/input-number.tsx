import { InputHTMLAttributes, useCallback } from 'react'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'
import { FieldByType } from './types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'

// see https://zukucode.com/2022/11/react-hook-form-typescript-control.html
type Props<
  TFieldValues extends FieldValues,
  TName extends FieldByType<TFieldValues, string>
> = UseControllerProps<TFieldValues, TName> &
  Exclude<
    Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'name'>,
    UseControllerProps<TFieldValues, TName>
  > & {
    label?: string
    className?: string
    innerClassName?: string
    setValue: (value: string) => void
  }

const InputNumber = <
  TFieldValues extends FieldValues,
  TName extends FieldByType<TFieldValues, string>
>(
  props: Props<TFieldValues, TName>
) => {
  const {
    name,
    control,
    rules,
    onChange,
    onBlur,
    label,
    className,
    innerClassName,
    setValue,
    ...fieldProps
  } = props
  const {
    field,
    formState: { errors }
  } = useController<TFieldValues, TName>({ control, name, rules })

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      field.onChange(e)
      if (onChange) onChange(e)
    },
    [field, onChange]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement, Element>) => {
      field.onBlur()
      if (onBlur) onBlur(e)
    },
    [field, onBlur]
  )

  const errorMessage = errors[name]?.message as string | undefined
  const borderClass = errorMessage ? 'border-red-500' : 'border-gray-300'

  const decrement = (e: any) => {
    e.preventDefault()
    const value = field.value ? Number(field.value) : 0
    const step = fieldProps.step ? Number(fieldProps.step) : 1
    const newValue = value - step
    if (fieldProps.min != null && newValue < Number(fieldProps.min)) return
    setValue(String(newValue))
  }

  const increment = (e: any) => {
    e.preventDefault()
    const value = field.value ? Number(field.value) : 0
    const step = fieldProps.step ? Number(fieldProps.step) : 1
    const newValue = value + step
    if (fieldProps.max != null && newValue > Number(fieldProps.max)) return
    setValue(String(newValue))
  }

  return (
    <div className={`${className ?? ''}`}>
      {label && <label className='block text-xs font-bold'>{label}</label>}
      <div className='flex'>
        <button
          className='rounded-l-lg border bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-600 disabled:bg-blue-200'
          onClick={decrement}
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
        <input
          type='number'
          className={`flex-1 border ${borderClass} max-w-20 px-2 py-1 text-right ${innerClassName}`}
          name={field.name}
          ref={field.ref}
          value={field.value}
          onChange={handleChange}
          onBlur={handleBlur}
          {...fieldProps}
        />
        <button
          className='rounded-r-lg border bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-600 disabled:bg-blue-200'
          onClick={increment}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      {errorMessage && <p className='text-xs text-red-500'>{errorMessage}</p>}
    </div>
  )
}

export default InputNumber
