'use client'

import { ScenarioType } from '@/@types/scenario-type'
import PrimaryButton from '@/components/button/primary-button'
import useModalState from '@/components/modal/modal-state'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AddUserScenarioModal from './add-user-scenario'

type Props = {
  scenarios: ScenarioResponse[]
  scenarioType: ScenarioType
  className?: string
  reload: () => void
}

const UserScenarioAddButton = (props: Props) => {
  const { scenarios, scenarioType, className, reload } = props
  const [isOpenModal, openModal, closeModal, toggleModal] = useModalState()

  const handlePostCreate = () => {
    reload()
    closeModal()
  }

  return (
    <>
      <PrimaryButton className={className} click={openModal}>
        <FontAwesomeIcon icon={faPlus} className='mr-2 h-4' />
        追加
      </PrimaryButton>
      {isOpenModal && (
        <AddUserScenarioModal
          scenarios={scenarios}
          scenarioType={scenarioType}
          toggleModal={toggleModal}
          postSave={handlePostCreate}
        />
      )}
    </>
  )
}
export default UserScenarioAddButton
