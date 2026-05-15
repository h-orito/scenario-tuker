'use client'

import PrimaryButton from '@/components/button/primary-button'
import useModalState from '@/components/modal/modal-state'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AddUserRuleBookModal from './add-user-rule-book'

type Props = {
  ruleBooks: RuleBookResponse[]
  className?: string
  reload: () => void
}

const UserRuleBookAddButton = (props: Props) => {
  const { ruleBooks, className, reload } = props
  const [isOpenModal, openModal, closeModal, toggleModal] = useModalState()

  const handlePostCreate = () => {
    reload()
    closeModal()
  }

  return (
    <>
      <PrimaryButton className={className} click={openModal}>
        <FontAwesomeIcon icon={faPlus} className='mr-2 h-4' />
        追加
      </PrimaryButton>
      {isOpenModal && (
        <AddUserRuleBookModal
          ruleBooks={ruleBooks}
          toggleModal={toggleModal}
          postSave={handlePostCreate}
        />
      )}
    </>
  )
}
export default UserRuleBookAddButton
