'use client'

import { useAuth } from '@/components/auth/use-auth'
import PrimaryButton from '@/components/button/primary-button'
import useModalState from '@/components/modal/modal-state'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModifyAuthorModal from '../modify-author'

type Props = {
  author: Author
}

const AuthorModifyButton = ({ author }: Props) => {
  const [isShowModal, openModal, , toggleModal] = useModalState()
  const reload = () => {
    location.reload()
  }

  const auth = useAuth()

  if (!auth.isSignedIn) {
    return <></>
  }

  return (
    <>
      <PrimaryButton className='ml-2 pb-1 pt-0' click={openModal}>
        <FontAwesomeIcon icon={faPencil} className='h-4' />
      </PrimaryButton>
      {isShowModal && (
        <ModifyAuthorModal
          author={author}
          toggleModal={toggleModal}
          postSave={reload}
        />
      )}
    </>
  )
}
export default AuthorModifyButton
