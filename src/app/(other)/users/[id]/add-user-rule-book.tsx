import { postRuleBooks } from '@/components/api/myself-api'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/scondary-button'
import FormLabel from '@/components/form/form-label'
import Modal from '@/components/modal/modal'
import RuleBooksSelectOrSearch from '@/components/pages/rule-books/rule-books-select-or-search'
import { useCallback, useMemo, useState } from 'react'

type Props = {
  ruleBooks: RuleBookResponse[]
  toggleModal: (e: any) => void
  postSave: () => void
}

const AddUserRuleBookModal = (props: Props) => {
  const { ruleBooks: userRuleBooks, toggleModal, postSave } = props
  const [ruleBooks, setRuleBooks] = useState<RuleBookResponse[]>([])
  const canSubmit: boolean = useMemo(() => ruleBooks.length > 0, [ruleBooks])

  const save = useCallback(async () => {
    for (const r of ruleBooks) {
      await postRuleBooks({
        rule_book_id: r.id
      })
    }
  }, [ruleBooks, postRuleBooks])

  const handleSave = async (e: any) => {
    e.preventDefault()
    await save()
    postSave()
  }

  const handleSetRuleBooks = (rs: RuleBookResponse[]) => {
    setRuleBooks(rs.filter((r) => !userRuleBooks.some((ur) => ur.id === r.id)))
  }

  return (
    <Modal close={toggleModal} hideFooter>
      <>
        <h2>所有ルールブック登録</h2>
        <div>
          <div className='my-6'>
            <FormLabel label='ルールブック' required />
            <RuleBooksSelectOrSearch
              selected={ruleBooks}
              setSelected={handleSetRuleBooks}
            />
          </div>
          <div className='mt-8 flex justify-end gap-2'>
            <SecondaryButton click={toggleModal}>キャンセル</SecondaryButton>
            <PrimaryButton disabled={!canSubmit} click={handleSave}>
              登録する
            </PrimaryButton>
          </div>
        </div>
      </>
    </Modal>
  )
}

export default AddUserRuleBookModal
