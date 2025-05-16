import { AllRuleBookType } from '@/@types/rule-book-type'
import {
  postRuleBook,
  putRuleBook,
  searchRuleBooks
} from '@/components/api/rule-book-api'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/scondary-button'
import FormLabel from '@/components/form/form-label'
import RadioGroup from '@/components/form/radio-group'
import Modal from '@/components/modal/modal'
import NormalNotification from '@/components/notification/normal-notification'
import RuleBookDictionaryWords from '@/components/pages/rule-books/form/rule-book-dictionary-words'
import { RuleBookFormInput } from '@/components/pages/rule-books/form/rule-book-form-input'
import RuleBookName from '@/components/pages/rule-books/form/rule-book-name'
import { useCallback, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const ModifyRuleBookModal = ({
  ruleBook,
  toggleModal,
  postSave
}: {
  ruleBook: RuleBookResponse
  toggleModal: (e: any) => void
  postSave?: (ruleBook: RuleBookResponse) => void
}) => {
  const [type, setType] = useState<string>(ruleBook.type)
  const { control, formState, handleSubmit } = useForm<RuleBookFormInput>({
    defaultValues: {
      name: ruleBook.name,
      dictionaryWords: ruleBook.dictionary_names.join('\n')
    }
  })
  const canSubmit: boolean = !formState.isSubmitting

  const save = useCallback(
    async (data: RuleBookFormInput) => {
      const name = data.name.trim()
      const dictionaryNames =
        data.dictionaryWords.trim().length <= 0
          ? []
          : data.dictionaryWords.trim().split('\n')
      // ルールブック名そのものも検索用ワードに含める
      if (!dictionaryNames.some((n) => n === name)) {
        dictionaryNames.unshift(name)
      }

      return await putRuleBook({
        id: ruleBook.id,
        name,
        dictionary_names: dictionaryNames,
        type,
        game_system_id: ruleBook.game_system.id
      })
    },
    [postRuleBook]
  )

  const existsRuleBook = useCallback(
    async (name: string) => {
      const ruleBooks = await searchRuleBooks({
        name: name,
        game_system_id: ruleBook.game_system.id,
        game_system_name: null,
        rule_book_type: null
      })
      return ruleBooks.list.some((s) => s.name === name && s.id !== ruleBook.id)
    },
    [searchRuleBooks]
  )

  const onSubmit: SubmitHandler<RuleBookFormInput> = useCallback(
    async (data) => {
      const ruleBook = await save(data)
      if (postSave) postSave(ruleBook)
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
        <h2>ルールブック編集</h2>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
            <div className='my-6'>
              <FormLabel label='ルールブック名' required />
              <RuleBookName control={control} existsRuleBook={existsRuleBook} />
            </div>
            <div className='my-6'>
              <FormLabel label='検索用ワード（改行区切り）' />
              <NormalNotification className='text-xs p-1 my-1'>
                <p>読み仮名などを入れておくことをお勧めします</p>
              </NormalNotification>
              <RuleBookDictionaryWords control={control} />
            </div>
            <div className='my-6'>
              <FormLabel label='ゲームシステム' />
              <div className='pt-2'>
                <p>{ruleBook.game_system.name}</p>
              </div>
            </div>
            <div className='my-6'>
              <FormLabel label='種別' required />
              <RadioGroup
                name='create-rule-book-type'
                className='justify-center'
                candidates={AllRuleBookType}
                selected={type}
                setSelected={setType}
              />
            </div>
            <div className='mt-8 flex justify-end gap-2'>
              <SecondaryButton click={toggleModal}>キャンセル</SecondaryButton>
              <PrimaryButton
                click={handleSubmit(onSubmit)}
                disabled={!canSubmit}
              >
                更新する
              </PrimaryButton>
            </div>
          </form>
        </div>
      </>
    </Modal>
  )
}
export default ModifyRuleBookModal
