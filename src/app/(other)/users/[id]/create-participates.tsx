import { DisclosureRange } from '@/@types/disclosure-range'
import { ScenarioType } from '@/@types/scenario-type'
import { postParticipates } from '@/components/api/myself-api'
import SecondaryButton from '@/components/button/scondary-button'
import SubmitButton from '@/components/button/submit-button'
import FormLabel from '@/components/form/form-label'
import Modal from '@/components/modal/modal'
import NormalNotification from '@/components/notification/normal-notification'
import ParticipateFormInput from '@/components/pages/participates/form/participate-form-input'
import RoleNamesSelect from '@/components/pages/participates/form/role-names-select'
import RuleBooksSelect from '@/components/pages/rule-books/rule-books-select'
import ScenariosSelect from '@/components/pages/scenarios/scenarios-select'
import { useCallback, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type Props = {
  scenarioType: ScenarioType
  toggleModal: (e: any) => void
  postSave: (participates: ParticipateResponse[]) => void
}

const CreateParticipatesModal = ({
  scenarioType,
  toggleModal,
  postSave
}: Props) => {
  const [scenarios, setScenarios] = useState<ScenarioResponse[]>([])
  const [ruleBooks, setRuleBooks] = useState<RuleBookResponse[]>([])
  const [roleNames, setRoleNames] = useState<string[]>([])

  // scenario, rule_bookのfiltering用
  const gameSystemId = useMemo(() => {
    const scenario = scenarios.find((s) => s.game_system)
    if (scenario) {
      return scenario.game_system!.id
    }
    if (ruleBooks.length <= 0) return null
    return ruleBooks[0].game_system.id
  }, [scenarios, ruleBooks])

  const { formState, handleSubmit } = useForm<ParticipateFormInput>({
    defaultValues: {
      from: '',
      to: '',
      requiredHours: '',
      playerNum: '',
      gameMaster: '',
      playerNames: '',
      memo: '',
      impression: ''
    }
  })
  const canSubmit: boolean = useMemo(() => {
    return (
      !formState.isSubmitting && scenarios.length > 0 && roleNames.length > 0
    )
  }, [formState.isSubmitting, scenarios, roleNames])

  const save = useCallback(
    async (data: ParticipateFormInput) => {
      const savedScenarios = []
      for (const s of scenarios) {
        const saved = await postParticipates({
          scenario_id: s.id,
          rule_book_ids: ruleBooks.map((r) => r.id),
          role_names: roleNames.map((r) => r.trim()),
          impression: {
            has_spoiler: false,
            disclosure_range: DisclosureRange.Everyone.value,
            content: ''
          },
          term_from: null,
          term_to: null,
          player_num: null,
          required_hours: null,
          game_master: null,
          player_names: null,
          memo: null
        })
        savedScenarios.push(saved)
      }
      return savedScenarios
    },
    [scenarios, ruleBooks, roleNames, postParticipates]
  )

  const onSubmit: SubmitHandler<ParticipateFormInput> = useCallback(
    async (data) => {
      const participates = await save(data)
      if (postSave) postSave(participates)
    },
    [save]
  )

  // Enter押下で登録させない
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.stopPropagation()
    }
  }

  return (
    <Modal close={toggleModal} hideFooter>
      <>
        <h2>通過記録一括登録</h2>
        <div>
          {scenarioType === ScenarioType.Trpg && (
            <NormalNotification className='text-xs'>
              同一ゲームシステムのシナリオ/ルールブックを選択し、通過記録を一括登録できます。
            </NormalNotification>
          )}
          <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
            <div className='my-6'>
              <FormLabel label='シナリオ' required />
              <ScenariosSelect
                scenarioType={scenarioType}
                selected={scenarios}
                setSelected={setScenarios}
                gameSystemId={gameSystemId}
              />
            </div>
            {scenarioType === ScenarioType.Trpg && (
              <div className='my-6'>
                <FormLabel label='ルールブック' />
                <RuleBooksSelect
                  gameSystemId={gameSystemId}
                  selected={ruleBooks}
                  setSelected={setRuleBooks}
                />
              </div>
            )}
            <div className='my-6'>
              <FormLabel label='役割' required />
              <RoleNamesSelect
                selected={roleNames}
                setSelected={setRoleNames}
              />
            </div>
            <hr />
            <div className='my-6 flex justify-center'>
              <NormalNotification className='text-xs'>
                一括追加では感想などの任意項目は登録できません。
                追加後に個別に編集して登録してください。
              </NormalNotification>
            </div>
            <div className='mt-8 flex justify-end gap-2'>
              <SecondaryButton click={toggleModal}>キャンセル</SecondaryButton>
              <SubmitButton disabled={!canSubmit}>更新する</SubmitButton>
            </div>
          </form>
        </div>
      </>
    </Modal>
  )
}

export default CreateParticipatesModal
