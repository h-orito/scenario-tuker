import InputText from '@/components/form/input-text'
import { Control } from 'react-hook-form'
import ParticipateFormInput from './participate-form-input'

type Props = {
  control: Control<ParticipateFormInput, any>
}

const GameMaster = ({ control }: Props) => {
  return (
    <InputText
      name={'gameMaster'}
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

export default GameMaster
