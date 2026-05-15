'use client'

import {
  deleteRuleBook,
  deleteRuleBookCheck,
  integrateDeleteRuleBook
} from '@/components/api/rule-book-api'
import DangerButton from '@/components/button/danger-button'
import FormLabel from '@/components/form/form-label'
import Modal from '@/components/modal/modal'
import RuleBookSelect from '@/components/pages/rule-books/rule-book-select'
import { useCallback, useState } from 'react'

const DeleteRuleBookModal = ({
  ruleBook,
  toggleModal,
  postDelete
}: {
  ruleBook: RuleBookResponse
  toggleModal: (e: any) => void
  postDelete: () => void
}) => {
  return (
    <Modal close={toggleModal}>
      <>
        <h2>ルールブック削除</h2>
        <p className='my-6'>
          ルールブック
          <strong>{ruleBook.name}</strong> を削除しますか？
        </p>
        <RemoveRuleBookArea ruleBook={ruleBook} postDelete={postDelete} />
        <IntegrateRuleBookArea ruleBook={ruleBook} postDelete={postDelete} />
      </>
    </Modal>
  )
}
export default DeleteRuleBookModal

type RemoveRuleBookAreaProps = {
  ruleBook: RuleBookResponse
  postDelete: () => void
}

const RemoveRuleBookArea = ({
  ruleBook,
  postDelete
}: RemoveRuleBookAreaProps) => {
  const [errorMessage, setErrorMesssage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const del = async (): Promise<void> => {
    setSubmitting(true)
    const check = await deleteRuleBookCheck(ruleBook.id)
    if (!check.ok) {
      setErrorMesssage(check.message || null)
      setSubmitting(false)
      return
    }
    await deleteRuleBook(ruleBook.id)
    setSubmitting(false)
    postDelete()
  }

  return (
    <div className='bg-gray-200 my-6 p-4'>
      <h2>削除</h2>
      <p className='my-4'>
        通過記録やユーザー所有ルールブックと紐付いていない場合のみ削除できます。
      </p>
      <div>
        <DangerButton click={del} disabled={submitting || errorMessage != null}>
          削除
        </DangerButton>
        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
      </div>
    </div>
  )
}

const IntegrateRuleBookArea = ({
  ruleBook,
  postDelete
}: {
  ruleBook: RuleBookResponse
  postDelete: () => void
}) => {
  const [destRuleBook, setDestRuleBook] = useState<RuleBookResponse | null>(
    null
  )
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMesssage] = useState<string | null>(null)
  const integrate = useCallback(async () => {
    try {
      setSubmitting(true)
      await integrateDeleteRuleBook(ruleBook.id, destRuleBook!.id)
      setSubmitting(false)
      postDelete()
    } catch (e) {
      setErrorMesssage('統合に失敗しました')
    }
  }, [ruleBook, destRuleBook])

  return (
    <div className='bg-gray-200 my-6 p-4'>
      <h2>別ルールブックに統合</h2>
      <p className='my-4'>
        このルールブックを削除し、以下の内容を、指定したルールブックに付け替えます。
        <div className='flex justify-center'>
          <ul className='mt-4 list-disc text-left'>
            <li>検索用キーワード</li>
            <li>このルールブックの通過記録</li>
            <li>ユーザー所有ルールブック</li>
          </ul>
        </div>
      </p>
      <div className='my-4'>
        <FormLabel label='統合先ルールブック' />
        <RuleBookSelect selected={destRuleBook} setSelected={setDestRuleBook} />
      </div>
      <div>
        <DangerButton
          click={integrate}
          disabled={submitting || errorMessage != null}
        >
          削除して統合
        </DangerButton>
      </div>
    </div>
  )
}
