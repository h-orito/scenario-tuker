'use client'

import { putMyself } from '@/components/api/myself-api'
import { useAuth } from '@/components/auth/use-auth'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/scondary-button'
import SubmitButton from '@/components/button/submit-button'
import FormLabel from '@/components/form/form-label'
import InputText from '@/components/form/input-text'
import InputTextarea from '@/components/form/input-textarea'
import Modal from '@/components/modal/modal'
import useModalState from '@/components/modal/modal-state'
import MarkdownNotification from '@/components/notification/markdown-notification'
import NormalNotification from '@/components/notification/normal-notification'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type Props = {
  user: User
  reload: () => void
}

const UserIntroductionModifyButton = ({ user, reload }: Props) => {
  const [isShowModal, openModal, , toggleModal] = useModalState()
  const handlePostSave = () => {
    reload()
  }
  const canModify = useAuth().myself?.id === user.id
  if (!canModify) {
    return <></>
  }

  return (
    <>
      <PrimaryButton className='text-xs py-1' click={openModal}>
        <FontAwesomeIcon icon={faPencil} className='h-3 mr-1' />
        自己紹介編集
      </PrimaryButton>
      {isShowModal && (
        <UserIntroductionModifyModal
          user={user}
          toggleModal={toggleModal}
          postSave={handlePostSave}
        />
      )}
    </>
  )
}

export default UserIntroductionModifyButton

type ModalProps = {
  user: User
  toggleModal: (e: any) => void
  postSave: () => void
}
interface FormInput {
  name: string
  introduction: string
}
const UserIntroductionModifyModal = ({
  user,
  toggleModal,
  postSave
}: ModalProps) => {
  const { control, formState, handleSubmit, watch } = useForm<FormInput>({
    defaultValues: {
      name: user.name,
      introduction: user.introduction || ''
    }
  })
  const canSubmit: boolean = !formState.isSubmitting

  const save = useCallback(
    async (data: FormInput) => {
      return await putMyself({
        name: data.name,
        introduction: data.introduction
      })
    },
    [putMyself]
  )

  const onSubmit: SubmitHandler<FormInput> = useCallback(
    async (data) => {
      await save(data)
      if (postSave) postSave()
    },
    [save]
  )

  // Enter押下で登録させない
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.stopPropagation()
    }
  }

  const introduction = watch('introduction')

  return (
    <Modal close={toggleModal} hideFooter>
      <>
        <h2>ユーザー自己紹介編集</h2>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
            <div className='my-4'>
              <FormLabel label='ユーザー名' required />
              <NormalNotification className='text-xs my-1'>
                このユーザー名が表示され、ユーザー検索でもこの名前で検索されます。
              </NormalNotification>
              <InputText
                control={control}
                name='name'
                rules={{
                  required: '必須です',
                  maxLength: {
                    value: 50,
                    message: '50文字以内で入力してください'
                  }
                }}
                placeholder='ユーザー名'
                className='w-full'
              />
            </div>
            <div className='my-6'>
              <FormLabel label='自己紹介' />
              <NormalNotification className='text-xs my-1'>
                Markdown形式（
                <Link
                  href='https://qiita.com/oreo/items/82183bfbaac69971917f'
                  target='_blank'
                >
                  参考
                </Link>
                ）で入力できます。
              </NormalNotification>
              <InputTextarea
                rows={10}
                control={control}
                name='introduction'
                rules={{
                  maxLength: {
                    value: 10000,
                    message: '10000文字以内で入力してください'
                  }
                }}
                placeholder='自己紹介'
                className='w-full'
              />
            </div>
            <div className='my-6'>
              <FormLabel label='自己紹介プレビュー' />
              <MarkdownNotification>{introduction}</MarkdownNotification>
            </div>
            <div className='mt-8 flex justify-end gap-2'>
              <SecondaryButton click={toggleModal}>キャンセル</SecondaryButton>
              <SubmitButton disabled={!canSubmit}>更新する</SubmitButton>
            </div>
          </form>
        </div>
      </>
    </Modal>
  )
}
