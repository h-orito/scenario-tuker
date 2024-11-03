'use client'

import {
  AllGameMasterRequirementType,
  GameMasterRequirementType
} from '@/@types/game-master-requirement-type'
import { AllScenarioType, ScenarioType } from '@/@types/scenario-type'
import { postAuthor } from '@/components/api/author-api'
import { postScenario, searchScenarios } from '@/components/api/scenario-api'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/scondary-button'
import FormLabel from '@/components/form/form-label'
import RadioGroup from '@/components/form/radio-group'
import Modal from '@/components/modal/modal'
import NormalNotification from '@/components/notification/normal-notification'
import AuthorsSelect from '@/components/pages/authors/authors-select'
import GameSystemSelect from '@/components/pages/game-systems/game-system-select'
import ScenarioDictionaryWords from '@/components/pages/scenarios/form/scenario-dictionary-words'
import { ScenarioFormInput } from '@/components/pages/scenarios/form/scenario-form-input'
import ScenarioName from '@/components/pages/scenarios/form/scenario-name'
import ScenarioPlayTime from '@/components/pages/scenarios/form/scenario-play-time'
import ScenarioPlayerCount from '@/components/pages/scenarios/form/scenario-player-count'
import ScenarioUrl from '@/components/pages/scenarios/form/scenario-url'
import { useCallback, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import AuthorCreateButton from './author-create-button'

const CreateScenarioModal = ({
  scenarioType,
  toggleModal,
  postSave
}: {
  scenarioType: string
  toggleModal: (e: any) => void
  postSave?: (scenario: ScenarioResponse) => void
}) => {
  const initialType = useMemo(() => {
    return (
      AllScenarioType.find((v) => v.value === scenarioType)?.value ??
      ScenarioType.MurderMystery.value
    )
  }, [scenarioType])
  const [type, setType] = useState<string>(initialType)
  const [gameSystem, setGameSystem] = useState<GameSystem | null>(null)
  const [authors, setAuthors] = useState<Author[]>([])
  const [gameMasterRequirement, setGameMasterRequirement] = useState<string>(
    GameMasterRequirementType.Empty.value
  )
  const { control, formState, handleSubmit, getValues, setValue } =
    useForm<ScenarioFormInput>({
      defaultValues: {
        name: '',
        dictionaryWords: '',
        url: '',
        playerCountMin: '',
        playerCountMax: '',
        playTime: ''
      }
    })
  const canSubmit: boolean = !formState.isSubmitting

  const save = useCallback(
    async (data: ScenarioFormInput) => {
      const name = data.name.trim()
      const dictionaryNames =
        data.dictionaryWords.trim().length <= 0
          ? []
          : data.dictionaryWords.trim().split('\n')
      // シナリオ名そのものも検索用ワードに含める
      if (!dictionaryNames.some((n) => n === name)) {
        dictionaryNames.unshift(name)
      }
      return await postScenario({
        name,
        dictionary_names: dictionaryNames,
        type: type,
        url: data.url.trim(),
        game_system_id:
          type === ScenarioType.MurderMystery.value
            ? null
            : (gameSystem?.id ?? null),
        author_ids: authors.map((a) => a.id),
        game_master_requirement: gameMasterRequirement,
        player_num_min:
          data.playerCountMin === '' ? null : parseInt(data.playerCountMin),
        player_num_max:
          data.playerCountMax === '' ? null : parseInt(data.playerCountMax),
        required_hours: data.playTime === '' ? null : parseInt(data.playTime)
      })
    },
    [postAuthor, type, gameSystem, authors, gameMasterRequirement]
  )

  const existsScenario = useCallback(
    async (name: string) => {
      const scenarios = await searchScenarios({
        name,
        game_system_id: gameSystem?.id ?? null,
        game_system_name: null,
        type: type,
        author_name: null,
        player_num: null,
        player_num_empty: false
      })
      return scenarios.list.some((s) => s.name === name)
    },
    [searchScenarios]
  )

  const onSubmit: SubmitHandler<ScenarioFormInput> = useCallback(
    async (data) => {
      const scenario = await save(data)
      if (postSave) postSave(scenario)
    },
    [save]
  )

  // Enter押下で登録させない
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.stopPropagation()
    }
  }

  const handneCreateAuthor = async (author: Author) => {
    setAuthors([...authors, author])
  }

  return (
    <Modal close={toggleModal} hideFooter>
      <>
        <h2>シナリオ製作者登録</h2>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
            <div className='my-6'>
              <FormLabel label='シナリオ名' required />
              <ScenarioName control={control} existsScenario={existsScenario} />
            </div>
            <div className='my-6'>
              <FormLabel label='シナリオ検索用ワード（改行区切り）' />
              <NormalNotification className='text-xs p-1 my-1'>
                <p>読み仮名などを入れておくことをお勧めします</p>
              </NormalNotification>
              <ScenarioDictionaryWords control={control} />
            </div>
            <div className='my-6'>
              <FormLabel label='種別' required />
              <RadioGroup
                name='create-scenario-type'
                className='justify-center'
                candidates={AllScenarioType}
                selected={type}
                setSelected={setType}
              />
            </div>
            {type === ScenarioType.Trpg.value && (
              <div className='my-6'>
                <FormLabel label='ゲームシステム' required />
                <GameSystemSelect
                  selected={gameSystem}
                  setSelected={setGameSystem}
                />
              </div>
            )}
            <div className='my-6'>
              <FormLabel label='シナリオURL' />
              <ScenarioUrl control={control} />
            </div>
            <div className='my-6'>
              <FormLabel label='シナリオ製作者' />
              <div className='flex'>
                <AuthorsSelect selected={authors} setSelected={setAuthors} />
                <AuthorCreateButton postSave={handneCreateAuthor} />
              </div>
            </div>
            <div className='my-6'>
              <FormLabel label='ゲームマスター' />
              <RadioGroup
                name='create-scenario-game-master-type'
                className='justify-center'
                candidates={AllGameMasterRequirementType}
                selected={gameMasterRequirement}
                setSelected={setGameMasterRequirement}
              />
            </div>
            <div className='my-6'>
              <FormLabel label='PL人数' />
              <ScenarioPlayerCount
                control={control}
                getPlayerCountMin={() => getValues('playerCountMin')}
                getPlayerCountMax={() => getValues('playerCountMax')}
                setPlayerCountMin={(v: string) => setValue('playerCountMin', v)}
                setPlayerCountMax={(v: string) => setValue('playerCountMax', v)}
              />
            </div>
            <div className='my-6'>
              <FormLabel label='プレイ時間目安（h）' />
              <ScenarioPlayTime
                control={control}
                setValue={(v: string) => setValue('playTime', v)}
              />
            </div>
            <div className='mt-8 flex justify-end gap-2'>
              <SecondaryButton click={toggleModal}>キャンセル</SecondaryButton>
              <PrimaryButton
                click={handleSubmit(onSubmit)}
                disabled={!canSubmit}
              >
                登録する
              </PrimaryButton>
            </div>
          </form>
        </div>
      </>
    </Modal>
  )
}
export default CreateScenarioModal
