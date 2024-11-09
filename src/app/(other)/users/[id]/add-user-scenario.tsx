import { ScenarioType } from '@/@types/scenario-type'
import { postScenarios } from '@/components/api/myself-api'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/scondary-button'
import FormLabel from '@/components/form/form-label'
import Modal from '@/components/modal/modal'
import ScenariosSelectOrSearch from '@/components/pages/scenarios/scenarios-select-or-search'
import { useCallback, useMemo, useState } from 'react'

type Props = {
  scenarios: ScenarioResponse[]
  scenarioType: ScenarioType
  toggleModal: (e: any) => void
  postSave: () => void
}

const AddUserScenarioModal = (props: Props) => {
  const {
    scenarios: userScenarios,
    scenarioType,
    toggleModal,
    postSave
  } = props
  const [scenarios, setScenarios] = useState<ScenarioResponse[]>([])
  const canSubmit: boolean = useMemo(() => scenarios.length > 0, [scenarios])

  const save = useCallback(async () => {
    for (const s of scenarios) {
      await postScenarios({
        scenario_id: s.id
      })
    }
  }, [scenarios, postScenarios])

  const handleSave = async (e: any) => {
    e.preventDefault()
    await save()
    postSave()
  }

  const handleSetScenarios = (ss: ScenarioResponse[]) => {
    setScenarios(ss.filter((s) => !userScenarios.some((us) => us.id === s.id)))
  }

  return (
    <Modal close={toggleModal} hideFooter>
      <>
        <h2>所有シナリオ登録</h2>
        <div>
          <div className='my-6'>
            <FormLabel label='シナリオ' required />
            <ScenariosSelectOrSearch
              scenarioType={scenarioType}
              selected={scenarios}
              setSelected={handleSetScenarios}
              gameSystemId={null}
            />
          </div>
          <div className='mt-8 flex justify-end gap-2'>
            <SecondaryButton click={toggleModal}>キャンセル</SecondaryButton>
            <PrimaryButton disabled={!canSubmit} click={handleSave}>
              登録する
            </PrimaryButton>
          </div>
        </div>
      </>
    </Modal>
  )
}

export default AddUserScenarioModal
