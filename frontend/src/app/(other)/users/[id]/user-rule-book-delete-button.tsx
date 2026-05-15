'use client'

import { deleteRuleBooks } from '@/components/api/myself-api'
import DangerButton from '@/components/button/danger-button'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
  ruleBook: RuleBookResponse
  className?: string
  reload: () => void
}

const UserRuleBookDeleteButton = (props: Props) => {
  const { ruleBook, className, reload } = props

  const remove = async () => {
    if (
      !window.confirm(`所有ルールブック「${ruleBook.name}」を削除しますか？`)
    ) {
      return
    }
    await deleteRuleBooks(ruleBook.id)
    reload()
  }

  return (
    <>
      <DangerButton className={className} click={remove}>
        <FontAwesomeIcon icon={faTrash} className='h-3' />
      </DangerButton>
    </>
  )
}
export default UserRuleBookDeleteButton
