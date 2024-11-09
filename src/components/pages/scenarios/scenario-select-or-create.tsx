import { ScenarioType } from '@/@types/scenario-type'
import ScenarioCreateButton from '@/app/(other)/scenarios/[id]/scenario-create-button'
import useModalState from '@/components/modal/modal-state'
import ScenarioSearch from './scenario-search'
import ScenarioSelect from './scenario-select'

type Props = {
  scenarioType: ScenarioType
  gameSystemId: number | null
  selected: ScenarioResponse | null
  setSelected: (value: ScenarioResponse | null) => void
}

const ScenarioSelectOrCreate = ({
  scenarioType,
  gameSystemId,
  selected,
  setSelected
}: Props) => {
  const [isShowModal, openModal, closeModal, toggleModal] = useModalState()
  const handleScenarioSelect = (scenarioResponse: ScenarioResponse | null) => {
    setSelected(scenarioResponse)
  }

  return (
    <>
      <button className='text-xs border-none text-blue-500' onClick={openModal}>
        詳細検索
      </button>
      {isShowModal && (
        <ScenarioSearch
          scenarioType={scenarioType}
          toggleModal={toggleModal}
          closeModal={closeModal}
          setSelected={handleScenarioSelect}
        />
      )}
      <div className='flex'>
        <ScenarioSelect
          gameSystemId={gameSystemId}
          scenarioType={scenarioType}
          selected={selected}
          setSelected={handleScenarioSelect}
        />
        <ScenarioCreateButton
          scenarioType={scenarioType.value}
          postCreate={handleScenarioSelect}
          className='ml-1 py-0'
        />
      </div>
    </>
  )
}

export default ScenarioSelectOrCreate
