import { AllDisclosureRange } from '@/@types/disclosure-range'
import FormLabel from '@/components/form/form-label'
import InputTextarea from '@/components/form/input-textarea'
import RadioGroup from '@/components/form/radio-group'
import MarkdownNotification from '@/components/notification/markdown-notification'
import NormalNotification from '@/components/notification/normal-notification'
import Link from 'next/link'
import { Control, UseFormWatch } from 'react-hook-form'
import ParticipateFormInput from './participate-form-input'

type Props = {
  control: Control<ParticipateFormInput, any>
  watch: UseFormWatch<ParticipateFormInput>
  hasSpoiler: boolean
  setHasSpoiler: (value: boolean) => void
  disclosureRange: string
  setDisclosureRange: (value: string) => void
}

const Impressions = ({
  control,
  watch,
  hasSpoiler,
  setHasSpoiler,
  disclosureRange,
  setDisclosureRange
}: Props) => {
  const impressionContent = watch('impression')
  return (
    <>
      <div className='my-6'>
        <FormLabel label='内容' />
        <div className='flex justify-center'>
          <RadioGroup
            name={'has-spoiler'}
            selected={hasSpoiler ? 'true' : 'false'}
            setSelected={(value: string) => setHasSpoiler(value === 'true')}
            candidates={[
              {
                value: 'false',
                label: 'ネタバレなし'
              },
              {
                value: 'true',
                label: 'ネタバレあり'
              }
            ]}
          />
        </div>
      </div>
      <div className='my-6'>
        <FormLabel label='公開範囲' />
        <div className='flex justify-center'>
          <RadioGroup
            name={'disclosure-range'}
            selected={disclosureRange}
            setSelected={setDisclosureRange}
            candidates={AllDisclosureRange}
          />
        </div>
      </div>
      <div className='my-6'>
        <FormLabel label='感想' />
        <div className='flex justify-center'>
          <NormalNotification className='text-xs my-1 w-full md:w-3/5'>
            Markdown形式（
            <Link
              href='https://qiita.com/oreo/items/82183bfbaac69971917f'
              target='_blank'
            >
              参考
            </Link>
            ）で入力できます。
          </NormalNotification>
        </div>
        <InputTextarea
          rows={10}
          control={control}
          name='impression'
          rules={{
            maxLength: {
              value: 10000,
              message: '10000文字以内で入力してください'
            }
          }}
          placeholder='1万字以内で記入できます。'
          className='w-full md:w-4/5'
        />
        {impressionContent && (
          <div>
            <p>プレビュー</p>
            <div className='flex justify-center'>
              <MarkdownNotification className='w-full md:w-4/5'>
                {impressionContent}
              </MarkdownNotification>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Impressions
