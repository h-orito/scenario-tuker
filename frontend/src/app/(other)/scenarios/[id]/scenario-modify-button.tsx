'use client'

import { useAuth } from '@/components/auth/use-auth'
import PrimaryButton from '@/components/button/primary-button'
import useModalState from '@/components/modal/modal-state'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModifyScenarioModal from '../modify-scenario'

type Props = {
  scenario: ScenarioResponse
}

const ScenarioModifyButton = ({ scenario }: Props) => {
  const [isShowModal, openModal, , toggleModal] = useModalState()

  const reload = () => {
    location.reload()
  }

  if (!useAuth().isSignedIn) {
    return <></>
  }

  return (
    <>
      <PrimaryButton className='ml-2 pb-1 pt-0' click={openModal}>
        <FontAwesomeIcon icon={faPencil} className='h-4' />
      </PrimaryButton>
      {isShowModal && (
        <ModifyScenarioModal
          scenario={scenario}
          toggleModal={toggleModal}
          postSave={reload}
        />
      )}
    </>
  )
}
export default ScenarioModifyButton
