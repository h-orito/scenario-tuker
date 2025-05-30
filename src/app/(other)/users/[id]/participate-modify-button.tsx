'use client'

import { ScenarioType } from '@/@types/scenario-type'
import PrimaryButton from '@/components/button/primary-button'
import useModalState from '@/components/modal/modal-state'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModifyParticipateModal from './modify-participate'

type Props = {
  canModify: boolean
  participate: ParticipateResponse
  scenarioType: ScenarioType
  className?: string
  reload: () => void
}

const ParticipateModifyButton = (props: Props) => {
  const { canModify, participate, scenarioType, className, reload } = props
  const [isShowModal, openModal, closeModal, toggleModal] = useModalState()
  const handlePostCreate = () => {
    reload()
    closeModal()
  }

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
