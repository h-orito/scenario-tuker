import { putAuthor, searchAuthors } from '@/components/api/author-api'
import SecondaryButton from '@/components/button/scondary-button'
import SubmitButton from '@/components/button/submit-button'
import FormLabel from '@/components/form/form-label'
import InputText from '@/components/form/input-text'
import Modal from '@/components/modal/modal'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

interface FormInput {
  name: string
}

const ModifyAuthorModal = ({
  author,
  toggleModal,
  postSave
}: {
  author: Author
  toggleModal: (e: any) => void
  postSave?: (author: Author) => void
}) => {
  const { control, formState, handleSubmit } = useForm<FormInput>({
    defaultValues: {
      name: author.name
    }
  })
  const canSubmit: boolean = !formState.isSubmitting

  const save = useCallback(
    async (name: string) => {
      return await putAuthor({
        id: author.id,
        name
      })
    },
    [putAuthor]
  )

  const existsAuthor = useCallback(
    async (name: string) => {
      const authors = await searchAuthors({
        name
      })
      return authors.list.some((s) => s.name === name && s.id !== author.id)
    },
    [searchAuthors]
  )

  const onSubmit: SubmitHandler<FormInput> = useCallback(
    async (data) => {
      const author = await save(data.name)
      if (postSave) postSave(author)
    },
    [save]
  )

  // Enter押下で登録させない
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.stopPropagation()
    }
  }

  return (
    <Modal close={toggleModal} hideFooter>
      <>
        <h2>シナリオ製作者編集</h2>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
            <div className='my-4'>
              <FormLabel label='製作者名' required />
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
                placeholder='シナリオ製作者名'
                className='w-full'
              />
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
export default ModifyAuthorModal
