'use client'

import InputText from '@/components/form/input-text'
import { Control } from 'react-hook-form'
import { ScenarioFormInput } from './scenario-form-input'

type Props = {
  control: Control<ScenarioFormInput, any>
}

const ScenarioUrl = ({ control }: Props) => {
  return (
    <InputText
      control={control}
      name='url'
      rules={{
        maxLength: {
          value: 255,
          message: '255文字以内で入力してください'
        },
        validate: {
          domain: async (value) => {
            return value === '' || (await isAvailableUrl(value))
              ? undefined
              : 'URLはBOOTH、TALTO、Pixiv、キャラクターシート倉庫、Twitterのみ許可されています。' +
                  'それ以外で掲載したいものがある場合、管理人にご連絡ください。'
          }
        }
      }}
      placeholder='公式サイト、販売ページなどのURL'
      className='w-full'
    />
  )
}
export default ScenarioUrl

const availableDomains = [
  'booth.pm',
  'talto.cc',
  'www.pixiv.net',
  'character-sheets.appspot.com',
  'twitter.com',
  'x.com',
  'www.dlsite.com',
  'seesaawiki.jp',
  'drivethrurpg.com',
  'www.drivethrurpg.com'
]

// http / https で、ホストが許可ドメインと一致する（またはそのサブドメインである）か
// サーバー側（ScenarioUrl.isAvailable）と同じ判定にする
const isAvailableUrl = (url: string): boolean => {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return false
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false
  if (parsed.username !== '' || parsed.password !== '') return false
  const host = parsed.hostname.toLowerCase()
  return availableDomains.some((ad) => host === ad || host.endsWith(`.${ad}`))
}
