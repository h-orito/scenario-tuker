import { ScenarioType } from '@/@types/scenario-type'
import PrimaryButton from '@/components/button/primary-button'
import useModalState from '@/components/modal/modal-state'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModifyParticipatesModal from './modify-participates'

type Props = {
  participates: ParticipateResponse[]
  scenarioType: ScenarioType
  className?: string
  reload: () => void
}

const ParticipateModifyButton = (props: Props) => {
  const { participates, scenarioType, className, reload } = props
  const [isShowModal, openModal, closeModal, toggleModal] = useModalState()

  const handlePostModify = () => {
    reload()
    closeModal()
  }

  return (
    <>
      <PrimaryButton className={className} click={openModal}>
        <FontAwesomeIcon icon={faPencil} className='h-3 mr-2' />
        一括編集
      </PrimaryButton>
      {isShowModal && (
        <ModifyParticipatesModal
          participates={participates}
          scenarioType={scenarioType}
          toggleModal={toggleModal}
          postSave={handlePostModify}
        />
      )}
    </>
  )
}
export default ParticipateModifyButton
