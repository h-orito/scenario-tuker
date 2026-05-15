'use client'

import { ScenarioType } from '@/@types/scenario-type'
import PrimaryButton from '@/components/button/primary-button'
import useModalState from '@/components/modal/modal-state'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SortParticipatesModal from './sort-participates'

type Props = {
  participates: ParticipateResponse[]
  scenarioType: ScenarioType
  className?: string
  reload: () => void
}

const ParticipateSortButton = (props: Props) => {
  const { participates, scenarioType, className, reload } = props
  const [isOpenModal, openModal, closeModal, toggleModal] = useModalState()

  const handleSave = () => {
    reload()
    closeModal()
  }

  return (
    <>
      <PrimaryButton className={className} click={openModal}>
        <FontAwesomeIcon icon={faSort} className='mr-2 h-4' />
        並び替え
      </PrimaryButton>
      {isOpenModal && (
        <SortParticipatesModal
          participates={participates}
          type={scenarioType}
          toggleModal={toggleModal}
          postSave={handleSave}
        />
      )}
    </>
  )
}
export default ParticipateSortButton
