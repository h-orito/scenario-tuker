import InputText from '@/components/form/input-text'
import { Control } from 'react-hook-form'
import ParticipateFormInput from './participate-form-input'

type Props = {
  control: Control<ParticipateFormInput, any>
}

const PlayerNames = ({ control }: Props) => {
  return (
    <InputText
      className='w-full md:w-4/5'
      name={'playerNames'}
      control={control}
      rules={{
        maxLength: {
          value: 255,
          message: '255文字以内で入力してください'
        }
      }}
    />
  )
}

export default PlayerNames
