import InputText from '@/components/form/input-text'
import { Control } from 'react-hook-form'
import { GameSystemFormInput } from './game-system-form-input'

type Props = {
  control: Control<GameSystemFormInput, any>
  existsGameSystem: (name: string) => Promise<boolean>
}

const GameSystemName = ({ control, existsGameSystem }: Props) => {
  return (
    <InputText
      control={control}
      name='name'
      rules={{
        required: '必須です',
        maxLength: {
          value: 255,
          message: '255文字以内で入力してください'
        },
        validate: {
          exist: async (value) => {
            return (await existsGameSystem(value))
              ? '既に登録されています'
              : undefined
          }
        }
      }}
      placeholder='ゲームシステム名'
      className='w-full'
    />
  )
}
export default GameSystemName
