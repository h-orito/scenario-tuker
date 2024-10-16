'use client'

import PrimaryButton from '@/components/button/primary-button'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { useAuth } from '@/components/auth/use-auth'
import ModifyGameSystemModal from '../modify-game-system'

type Props = {
  gameSystem: GameSystem
}

const GameSystemModifyButton = ({ gameSystem }: Props) => {
  const [isShowModifyModel, setIsShowModifyModel] = useState(false)
  const openModifyModal = () => {
    setIsShowModifyModel(true)
  }
  const toggleModifyModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsShowModifyModel(!isShowModifyModel)
    }
  }
  const reload = () => {
    location.reload()
  }

  const auth = useAuth()

  if (!auth.isSignedIn) {
    return <></>
  }

  return (
    <>
      <PrimaryButton className='ml-2 pb-1 pt-0' click={openModifyModal}>
        <FontAwesomeIcon icon={faPencil} className='h-4' />
      </PrimaryButton>
      {isShowModifyModel && (
        <ModifyGameSystemModal
          gameSystem={gameSystem}
          toggleModal={toggleModifyModal}
          postSave={reload}
        />
      )}
    </>
  )
}
export default GameSystemModifyButton
