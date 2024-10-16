'use client'

import { useAuth } from '@/components/auth/use-auth'
import PrimaryButton from '@/components/button/primary-button'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import CreateGameSystemModal from '../game-systems/create-game-system'

type Props = {
  postSave: (gameSystem: GameSystem) => void
}

const GameSystemCreateButton = ({ postSave }: Props) => {
  const [isShowModel, setIsShowModel] = useState(false)
  const openModal = (e: any) => {
    e.preventDefault()
    setIsShowModel(true)
  }
  const toggleModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsShowModel(!isShowModel)
    }
  }

  const handlePostSave = (gamesystem: GameSystem) => {
    postSave(gamesystem)
    setIsShowModel(false)
  }

  const auth = useAuth()

  if (!auth.isSignedIn) {
    return <></>
  }

  return (
    <>
      <PrimaryButton className='ml-1 py-0' click={openModal}>
        <FontAwesomeIcon icon={faPlus} className='mr-1' />
        新規
      </PrimaryButton>
      {isShowModel && (
        <CreateGameSystemModal
          toggleModal={toggleModal}
          postSave={handlePostSave}
        />
      )}
    </>
  )
}
export default GameSystemCreateButton
