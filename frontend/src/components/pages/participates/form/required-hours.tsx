import InputNumber from '@/components/form/input-number'
import { Control, UseFormSetValue } from 'react-hook-form'
import ParticipateFormInput from './participate-form-input'

type Props = {
  control: Control<ParticipateFormInput, any>
  setValue: UseFormSetValue<ParticipateFormInput>
}

const RequiredHours = ({ control, setValue }: Props) => {
  return (
    <InputNumber
      control={control}
      name='requiredHours'
      setValue={(value: string) => setValue('requiredHours', value)}
      rules={{
        max: {
          value: 100,
          message: '1000時間以内で入力してください'
        }
      }}
    />
  )
}

export default RequiredHours
