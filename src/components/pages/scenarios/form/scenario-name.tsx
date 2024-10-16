'use client'

import InputText from '@/components/form/input-text'
import { Control } from 'react-hook-form'
import { ScenarioFormInput } from './scenario-form-input'

type Props = {
  control: Control<ScenarioFormInput, any>
  existsScenario: (name: string) => Promise<boolean>
}

const ScenarioName = ({ control, existsScenario }: Props) => {
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
            return (await existsScenario(value))
              ? '既に登録されています'
              : undefined
          }
        }
      }}
      placeholder='シナリオ名'
      className='w-full'
      autoFocus
    />
  )
}
export default ScenarioName
