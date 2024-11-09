import InputText from '@/components/form/input-text'
import NormalNotification from '@/components/notification/normal-notification'
import { Control } from 'react-hook-form'
import ParticipateFormInput from './participate-form-input'

type Props = {
  control: Control<ParticipateFormInput, any>
}

const ParticipateMemo = ({ control }: Props) => {
  return (
    <>
      <div className='flex justify-center my-1'>
        <NormalNotification className='w-full md:w-3/5 text-xs'>
          ネタバレ要素を含む内容は感想に記入してください
        </NormalNotification>
      </div>
      <InputText
        className='w-full md:w-4/5'
        name={'memo'}
        control={control}
        rules={{
          maxLength: {
            value: 255,
            message: '255文字以内で入力してください'
          }
        }}
      />
    </>
  )
}

export default ParticipateMemo
