import InputNumber from '@/components/form/input-number'
import { Control, UseFormSetValue } from 'react-hook-form'
import ParticipateFormInput from './participate-form-input'

type Props = {
  control: Control<ParticipateFormInput, any>
  setValue: UseFormSetValue<ParticipateFormInput>
}

const PlayerNum = ({ control, setValue }: Props) => {
  return (
    <InputNumber
      control={control}
      name='playerNum'
      setValue={(value: string) => setValue('playerNum', value)}
      rules={{
        max: {
          value: 100,
          message: '100人以内で入力してください'
        }
      }}
    />
  )
}

export default PlayerNum
