import { DisclosureRange } from '@/@types/disclosure-range'
import { ScenarioType } from '@/@types/scenario-type'
import { postParticipates } from '@/components/api/myself-api'
import SecondaryButton from '@/components/button/scondary-button'
import SubmitButton from '@/components/button/submit-button'
import FormLabel from '@/components/form/form-label'
import Modal from '@/components/modal/modal'
import NormalNotification from '@/components/notification/normal-notification'
import GameSystemSelect from '@/components/pages/game-systems/game-system-select'
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
  const [gameSystem, setGameSystem] = useState<GameSystem | null>(null)
  const [scenarios, setScenarios] = useState<ScenarioResponse[]>([])
  const [ruleBooks, setRuleBooks] = useState<RuleBookResponse[]>([])
  const [roleNames, setRoleNames] = useState<string[]>([])

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
      !formState.isSubmitting &&
      scenarios.length > 0 &&
      roleNames.length > 0 &&
      (scenarioType !== ScenarioType.Trpg || gameSystem != null)
    )
  }, [formState.isSubmitting, scenarios, roleNames])

  const save = useCallback(
    async (data: ParticipateFormInput) => {
      const savedScenarios = []
      for (const s of scenarios) {
        const saved = await postParticipates({
          scenario_id: s.id,
          game_system_id: gameSystem?.id ?? null,
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

  // ゲームシステムとルールブックの整合性担保
  const handleScenarioChange = (values: ScenarioResponse[]) => {
    setScenarios(values)
    if (gameSystem) {
      if (
        values.some((s) =>
          s.game_systems.every((gs) => gs.id !== gameSystem.id)
        )
      ) {
        setGameSystem(null)
      }
    } else {
      // ゲームシステムが選択されていない場合は自動選択
      if (values.length === 1 && values[0].game_systems.length === 1) {
        setGameSystem(values[0].game_systems[0])
      }
    }
  }
  const handleGameSystemChange = (value: GameSystem | null) => {
    setGameSystem(value)
    if (value) {
      if (ruleBooks.some((rb) => rb.game_system.id !== value.id)) {
        setRuleBooks(ruleBooks.filter((rb) => rb.game_system.id === value.id))
      }
      setScenarios(
        scenarios.filter((s) => s.game_systems.some((gs) => gs.id === value.id))
      )
    } else {
      setScenarios([])
      setRuleBooks([])
    }
  }
  const handleRuleBooksChange = (value: RuleBookResponse[]) => {
    setRuleBooks(value)
    if (gameSystem) {
      if (value.some((rb) => rb.game_system.id !== gameSystem.id)) {
        setGameSystem(null)
      }
    } else {
      // ゲームシステムが選択されていない場合は自動選択
      if (value.length === 1) {
        setGameSystem(value[0].game_system)
      }
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
            {scenarioType === ScenarioType.Trpg && (
              <div className='my-6'>
                <FormLabel label='ゲームシステム' required />
                <GameSystemSelect
                  selected={gameSystem}
                  setSelected={handleGameSystemChange}
                />
              </div>
            )}
            <div className='my-6'>
              <FormLabel label='シナリオ' required />
              <ScenariosSelect
                scenarioType={scenarioType}
                selected={scenarios}
                setSelected={handleScenarioChange}
                gameSystemId={gameSystem?.id ?? null}
              />
            </div>
            {scenarioType === ScenarioType.Trpg && (
              <div className='my-6'>
                <FormLabel label='ルールブック' />
                <RuleBooksSelect
                  gameSystemId={gameSystem?.id ?? null}
                  selected={ruleBooks}
                  setSelected={handleRuleBooksChange}
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
