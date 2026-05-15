'use client'

import InputTextarea from '@/components/form/input-textarea'
import { Control } from 'react-hook-form'
import { RuleBookFormInput } from './rule-book-form-input'

type Props = {
  control: Control<RuleBookFormInput, any>
}

const RuleBookDictionaryWords = ({ control }: Props) => {
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
export default RuleBookDictionaryWords
