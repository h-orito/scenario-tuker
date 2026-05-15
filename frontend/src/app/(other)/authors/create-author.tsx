import { postAuthor, searchAuthors } from '@/components/api/author-api'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/scondary-button'
import FormLabel from '@/components/form/form-label'
import Modal from '@/components/modal/modal'
import AuthorName from '@/components/pages/authors/author-name'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

interface FormInput {
  name: string
}

const CreateAuthorModal = ({
  toggleModal,
  postSave
}: {
  toggleModal: (e: any) => void
  postSave?: (author: Author) => void
}) => {
  const { control, formState, handleSubmit } = useForm<FormInput>({
    defaultValues: {
      name: ''
    }
  })
  const canSubmit: boolean = !formState.isSubmitting

  const save = useCallback(
    async (name: string) => {
      return await postAuthor({
        id: 0,
        name
      })
    },
    [postAuthor]
  )

  const existsAuthor = useCallback(
    async (name: string) => {
      const authors = await searchAuthors({
        name
      })
      return authors.list.some((s) => s.name === name)
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
        <h2>シナリオ製作者登録</h2>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
            <div className='my-4'>
              <FormLabel label='製作者名' required />
              <AuthorName control={control} existsAuthor={existsAuthor} />
            </div>
            <div className='mt-8 flex justify-end gap-2'>
              <SecondaryButton click={toggleModal}>キャンセル</SecondaryButton>
              <PrimaryButton
                click={handleSubmit(onSubmit)}
                disabled={!canSubmit}
              >
                登録する
              </PrimaryButton>
            </div>
          </form>
        </div>
      </>
    </Modal>
  )
}
export default CreateAuthorModal
