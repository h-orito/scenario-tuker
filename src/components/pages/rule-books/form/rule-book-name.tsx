import InputText from '@/components/form/input-text'
import { Control } from 'react-hook-form'
import { RuleBookFormInput } from './rule-book-form-input'

type Props = {
  control: Control<RuleBookFormInput, any>
  existsRuleBook: (name: string) => Promise<boolean>
}

const RuleBookName = ({ control, existsRuleBook }: Props) => {
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
            return (await existsRuleBook(value))
              ? '既に登録されています'
              : undefined
          }
        }
      }}
      placeholder='ルールブック名'
      className='w-full'
    />
  )
}
export default RuleBookName
