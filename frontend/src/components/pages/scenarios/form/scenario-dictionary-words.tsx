'use client'

import { Control } from 'react-hook-form'
import { ScenarioFormInput } from './scenario-form-input'
import InputTextarea from '@/components/form/input-textarea'

type Props = {
  control: Control<ScenarioFormInput, any>
}

const ScenarioDictionaryWords = ({ control }: Props) => {
  return (
    <InputTextarea
      rows={10}
      control={control}
      name='dictionaryWords'
      rules={{
        validate: {
          len: (value) => {
            return value.length === 0 ||
              value
                .replace('\r\n', '\n')
                .split('\n')
                .every((dn) => {
                  const length = dn.length
                  return 0 < length && length <= 255
                })
              ? undefined
              : '各行255文字以内で入力してください'
          }
        }
      }}
      placeholder='検索用ワード'
      className='w-full'
    />
  )
}
export default ScenarioDictionaryWords
