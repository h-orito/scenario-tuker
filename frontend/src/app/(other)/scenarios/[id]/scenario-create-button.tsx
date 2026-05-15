'use client'

import { useAuth } from '@/components/auth/use-auth'
import PrimaryButton from '@/components/button/primary-button'
import useModalState from '@/components/modal/modal-state'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CreateScenarioModal from '../create-scenario'

type Props = {
  scenarioType: string
  className?: string
  postCreate: (scenario: ScenarioResponse) => void
}

const ScenarioCreateButton = ({
  scenarioType,
  className,
  postCreate
}: Props) => {
  const [isShowModal, openModal, , toggleModal] = useModalState()

  if (!useAuth().isSignedIn) {
    return <></>
  }

  return (
    <>
      <PrimaryButton className={className} click={openModal}>
        <FontAwesomeIcon icon={faPlus} className='mr-2 h-4' />
        追加
      </PrimaryButton>
      {isShowModal && (
        <CreateScenarioModal
          scenarioType={scenarioType}
          toggleModal={toggleModal}
          postSave={postCreate}
        />
      )}
    </>
  )
}
export default ScenarioCreateButton
