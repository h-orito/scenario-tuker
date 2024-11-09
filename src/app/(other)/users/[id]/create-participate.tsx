import { DisclosureRange } from '@/@types/disclosure-range'
import { ScenarioType } from '@/@types/scenario-type'
import { postParticipates } from '@/components/api/myself-api'
import SecondaryButton from '@/components/button/scondary-button'
import SubmitButton from '@/components/button/submit-button'
import FormLabel from '@/components/form/form-label'
import Modal from '@/components/modal/modal'
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
  const [ruleBooks, setRuleBooks] = useState<RuleBookResponse[]>([])
  const [roleNames, setRoleNames] = useState<string[]>([])
  const [hasSpoiler, setHasSpoiler] = useState<boolean>(true)
  const [disclosureRange, setDisclosureRange] = useState<string>(
    DisclosureRange.Everyone.value
  )

  // scenario, rule_bookのfiltering用
  const gameSystemId = useMemo(() => {
    if (scenario?.game_system) return scenario.game_system.id
    if (ruleBooks.length <= 0) return null
    return ruleBooks[0].game_system.id
  }, [scenario, ruleBooks])

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
    return !formState.isSubmitting && scenario != null && roleNames.length > 0
  }, [formState.isSubmitting, scenario, roleNames])

  const save = useCallback(
    async (data: ParticipateFormInput) => {
      return await postParticipates({
        scenario_id: scenario?.id ?? 0,
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
                setSelected={setScenario}
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
