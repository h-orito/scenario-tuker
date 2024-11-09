'use client'

import { ScenarioType } from '@/@types/scenario-type'
import { useAuth } from '@/components/auth/use-auth'
import PrimaryButton from '@/components/button/primary-button'
import useModalState from '@/components/modal/modal-state'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModifyParticipateModal from './modify-participate'

type Props = {
  participate: ParticipateResponse
  scenarioType: ScenarioType
  className?: string
  reload: () => void
}

const ParticipateModifyButton = (props: Props) => {
  const { participate, scenarioType, className, reload } = props
  const [isShowModal, openModal, closeModal, toggleModal] = useModalState()
  const handlePostCreate = () => {
    reload()
    closeModal()
  }

  const canModify = useAuth().myself?.id === participate.user.id

  return (
    <>
      <PrimaryButton
        className={className}
        click={openModal}
        disabled={!canModify}
      >
        <FontAwesomeIcon icon={faPencil} className='h-3' />
      </PrimaryButton>
      {isShowModal && (
        <ModifyParticipateModal
          participate={participate}
          scenarioType={scenarioType}
          toggleModal={toggleModal}
          postSave={handlePostCreate}
        />
      )}
    </>
  )
}
export default ParticipateModifyButton
