import { ScenarioType } from '@/@types/scenario-type'
import useModalState from '@/components/modal/modal-state'
import ScenariosSearch from './scenarios-search'
import ScenariosSelect from './scenarios-select'

type Props = {
  gameSystemId: number | null
  scenarioType: ScenarioType
  selected: ScenarioResponse[]
  setSelected: (value: ScenarioResponse[]) => void
}

const ScenariosSelectOrSearch = (props: Props) => {
  const { gameSystemId, scenarioType, selected, setSelected } = props
  const [isShowModal, openModal, closeModal, toggleModal] = useModalState()
  const handleScenariosSelect = (scenarios: ScenarioResponse[]) => {
    setSelected(scenarios)
    if (isShowModal) closeModal()
  }

  return (
    <>
      <button className='text-xs border-none text-blue-500' onClick={openModal}>
        詳細検索
      </button>
      {isShowModal && (
        <ScenariosSearch
          scenarioType={scenarioType}
          toggleModal={toggleModal}
          closeModal={closeModal}
          setSelected={handleScenariosSelect}
        />
      )}
      <ScenariosSelect
        gameSystemId={gameSystemId}
        scenarioType={scenarioType}
        selected={selected}
        setSelected={handleScenariosSelect}
      />
    </>
  )
}

export default ScenariosSelectOrSearch
