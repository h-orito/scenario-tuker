import { DisclosureRange } from '@/@types/disclosure-range'
import { ScenarioType } from '@/@types/scenario-type'
import { postParticipates } from '@/components/api/myself-api'
import SecondaryButton from '@/components/button/scondary-button'
import SubmitButton from '@/components/button/submit-button'
import FormLabel from '@/components/form/form-label'
import Modal from '@/components/modal/modal'
import GameSystemSelect from '@/components/pages/game-systems/game-system-select'
import GameMaster from '@/components/pages/participates/form/game-master'
import Impressions from '@/components/pages/participates/form/impressions'
import InputFrom from '@/components/pages/participates/form/input-from'
import InputTo from '@/components/pages/participates/form/input-to'
import ParticipateFormInput from '@/components/pages/participates/form/participate-form-input'
import ParticipateMemo from '@/components/pages/participates/form/participate-memo'
import PlayerNames from '@/components/pages/participates/form/player-names'
import PlayerNum from '@/components/pages/participates/form/player-num'
import RequiredHours from '@/components/pages/participates/form/required-hours'
import RoleNamesSelect from '@/components/pages/participates/form/role-names-select'
import RuleBooksSelect from '@/components/pages/rule-books/rule-books-select'
import ScenarioSelectOrCreate from '@/components/pages/scenarios/scenario-select-or-create'
import { useCallback, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type Props = {
  scenarioType: ScenarioType
  toggleModal: (e: any) => void
  postSave: (participate: ParticipateResponse) => void
}

const CreateParticipateModal = ({
  scenarioType,
  toggleModal,
  postSave
}: Props) => {
  const [scenario, setScenario] = useState<ScenarioResponse | null>(null)
  const [gameSystem, setGameSystem] = useState<GameSystem | null>(null)
  const [ruleBooks, setRuleBooks] = useState<RuleBookResponse[]>([])
  const [roleNames, setRoleNames] = useState<string[]>([])
  const [hasSpoiler, setHasSpoiler] = useState<boolean>(true)
  const [disclosureRange, setDisclosureRange] = useState<string>(
    DisclosureRange.Everyone.value
  )

  const { control, formState, handleSubmit, getValues, setValue, watch } =
    useForm<ParticipateFormInput>({
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
      scenario != null &&
      roleNames.length > 0 &&
      (scenarioType !== ScenarioType.Trpg || gameSystem != null) // TRPGの場合はゲームシステムが必要
    )
  }, [formState.isSubmitting, scenario, roleNames, gameSystem, scenarioType])

  const save = useCallback(
    async (data: ParticipateFormInput) => {
      return await postParticipates({
        scenario_id: scenario?.id ?? 0,
        game_system_id: gameSystem?.id ?? null,
        rule_book_ids: ruleBooks.map((r) => r.id),
        role_names: roleNames.map((r) => r.trim()),
        impression: {
          has_spoiler: hasSpoiler,
          disclosure_range: disclosureRange,
          content: data.impression
        },
        term_from: data.from ? data.from : null,
        term_to: data.to ? data.to : null,
        player_num: parseInt(data.playerNum),
        required_hours: parseInt(data.requiredHours),
        game_master: data.gameMaster,
        player_names: data.playerNames,
        memo: data.memo
      })
    },
    [
      scenario,
      ruleBooks,
      roleNames,
      hasSpoiler,
      disclosureRange,
      postParticipates
    ]
  )

  const onSubmit: SubmitHandler<ParticipateFormInput> = useCallback(
    async (data) => {
      const participate = await save(data)
      if (postSave) postSave(participate)
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
  const handleScenarioChange = (value: ScenarioResponse | null) => {
    setScenario(value)
    if (value) {
      // シナリオに含まれるゲームシステムで絞り込む
      if (value.game_systems.every((gs) => gs.id !== gameSystem?.id)) {
        setGameSystem(null)
      }
      setRuleBooks(
        ruleBooks.filter((rb) =>
          value.game_systems.some((gs) => gs.id === rb.game_system.id)
        )
      )
      // ゲームシステムが1つの場合は自動選択
      if (value.game_systems.length === 1) {
        setGameSystem(value.game_systems[0])
      }
    }
  }
  const handleGameSystemChange = (value: GameSystem | null) => {
    setGameSystem(value)
    if (value) {
      if (ruleBooks.some((rb) => rb.game_system.id !== value.id)) {
        setRuleBooks(ruleBooks.filter((rb) => rb.game_system.id === value.id))
      }
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
        <h2>通過記録登録</h2>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
            <div className='my-6'>
              <FormLabel label='シナリオ' required />
              <ScenarioSelectOrCreate
                scenarioType={scenarioType}
                selected={scenario}
                setSelected={handleScenarioChange}
                gameSystemId={gameSystem?.id ?? null}
              />
            </div>
            {scenarioType === ScenarioType.Trpg && (
              <>
                <div className='my-6'>
                  <FormLabel label='ゲームシステム' required />
                  <GameSystemSelect
                    gameSystemIds={scenario?.game_systems.map((gs) => gs.id)}
                    selected={gameSystem}
                    setSelected={handleGameSystemChange}
                  />
                </div>
                <div className='my-6'>
                  <FormLabel label='ルールブック' />
                  <RuleBooksSelect
                    gameSystemId={gameSystem?.id ?? null}
                    gameSystemIds={scenario?.game_systems.map((gs) => gs.id)}
                    selected={ruleBooks}
                    setSelected={handleRuleBooksChange}
                  />
                </div>
              </>
            )}
            <div className='my-6'>
              <FormLabel label='役割' required />
              <RoleNamesSelect
                selected={roleNames}
                setSelected={setRoleNames}
              />
            </div>
            <hr />
            <div className='my-6'>
              <FormLabel label='日程' />
              <div className='flex justify-center'>
                <InputFrom control={control} getValues={getValues} />
                <div className='my-auto'>&nbsp;～&nbsp;</div>
                <InputTo control={control} getValues={getValues} />
              </div>
            </div>
            <div className='my-6'>
              <FormLabel label='プレイ時間（h）' />
              <div className='flex justify-center'>
                <RequiredHours control={control} setValue={setValue} />
              </div>
            </div>
            <hr />
            <div className='my-6'>
              <FormLabel label='PL人数' />
              <div className='flex justify-center'>
                <PlayerNum control={control} setValue={setValue} />
              </div>
            </div>
            <div className='my-6'>
              <FormLabel label='GM' />
              <GameMaster control={control} />
            </div>
            <div className='my-6'>
              <FormLabel label='参加PL' />
              <PlayerNames control={control} />
            </div>
            <hr />
            <div className='my-6'>
              <FormLabel label='ひとことメモ' />
              <ParticipateMemo control={control} />
            </div>
            <hr />
            <div className='my-6'>
              <FormLabel label='感想' />
              <Impressions
                control={control}
                watch={watch}
                hasSpoiler={hasSpoiler}
                setHasSpoiler={setHasSpoiler}
                disclosureRange={disclosureRange}
                setDisclosureRange={setDisclosureRange}
              />
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

export default CreateParticipateModal
