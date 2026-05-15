import InputDate from '@/components/form/input-date'
import { Control, UseFormGetValues } from 'react-hook-form'
import ParticipateFormInput from './participate-form-input'

const InputFrom = ({
  control,
  getValues
}: {
  control: Control<ParticipateFormInput, any>
  getValues: UseFormGetValues<ParticipateFormInput>
}) => {
  return (
    <InputDate
      control={control}
      name='from'
      className='flex-1'
      rules={{
        validate: {
          lessThan: (value) => {
            if (!value) return undefined
            const to = getValues('to')
            if (!to) return undefined
            return value.localeCompare(to) <= 0
              ? undefined
              : '開始日は終了日より前である必要があります'
          }
        }
      }}
    />
  )
}

export default InputFrom
