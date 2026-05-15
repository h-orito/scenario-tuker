'use client'

import { useAuth } from '@/components/auth/use-auth'
import PrimaryButton from '@/components/button/primary-button'
import useModalState from '@/components/modal/modal-state'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CreateGameSystemModal from '../create-game-system'

type Props = {
  className?: string
  postSave: (gameSystem: GameSystem) => void
}

const GameSystemCreateButton = ({ className, postSave }: Props) => {
  const [isShowModal, openModal, closeModal, toggleModal] = useModalState()

  const handlePostSave = (gamesystem: GameSystem) => {
    postSave(gamesystem)
    closeModal()
  }

  if (!useAuth().isSignedIn) {
    return <></>
  }

  return (
    <>
      <PrimaryButton className={className} click={openModal}>
        <FontAwesomeIcon icon={faPlus} className='mr-1' />
        新規
      </PrimaryButton>
      {isShowModal && (
        <CreateGameSystemModal
          toggleModal={toggleModal}
          postSave={handlePostSave}
        />
      )}
    </>
  )
}
export default GameSystemCreateButton
