'use client'

import { useAuth } from '@/components/auth/use-auth'
import PrimaryButton from '@/components/button/primary-button'
import useModalState from '@/components/modal/modal-state'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CreateAuthorModal from '../create-author'

type Props = {
  className?: string
  postSave: (author: Author) => void
}

const AuthorCreateButton = ({ className, postSave }: Props) => {
  const [isShowModal, openModal, closeModal, toggleModal] = useModalState()

  const handlePostSave = (author: Author) => {
    postSave(author)
    closeModal()
  }

  const auth = useAuth()

  if (!auth.isSignedIn) {
    return <></>
  }

  return (
    <>
      <PrimaryButton className={className} click={openModal}>
        <FontAwesomeIcon icon={faPlus} className='mr-1' />
        新規
      </PrimaryButton>
      {isShowModal && (
        <CreateAuthorModal
          toggleModal={toggleModal}
          postSave={handlePostSave}
        />
      )}
    </>
  )
}
export default AuthorCreateButton
