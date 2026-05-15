import InputDate from '@/components/form/input-date'
import { Control, UseFormGetValues } from 'react-hook-form'
import ParticipateFormInput from './participate-form-input'

const InputTo = ({
  control,
  getValues
}: {
  control: Control<ParticipateFormInput, any>
  getValues: UseFormGetValues<ParticipateFormInput>
}) => {
  return (
    <InputDate
      control={control}
      name='to'
      className='flex-1'
      rules={{
        validate: {
          greaterThan: (value) => {
            if (!value) return undefined
            const from = getValues('from')
            if (!from) return undefined
            return value.localeCompare(from) >= 0
              ? undefined
              : '終了日は開始日より後である必要があります'
          }
        }
      }}
    />
  )
}
export default InputTo
