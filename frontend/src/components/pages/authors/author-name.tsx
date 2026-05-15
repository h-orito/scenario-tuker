import InputText from '@/components/form/input-text'
import { Control } from 'react-hook-form'
import { AuthorFormInput } from './author-form-input'

type Props = {
  control: Control<AuthorFormInput, any>
  existsAuthor: (name: string) => Promise<boolean>
}

const AuthorName = ({ control, existsAuthor }: Props) => {
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
            return (await existsAuthor(value))
              ? '既に登録されています'
              : undefined
          }
        }
      }}
      placeholder='ゲーム製作者名'
      className='w-full'
    />
  )
}
export default AuthorName
