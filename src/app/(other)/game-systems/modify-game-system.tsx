import {
  postGameSystem,
  putGameSystem,
  searchGameSystems
} from '@/components/api/game-system-api'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/scondary-button'
import FormLabel from '@/components/form/form-label'
import Modal from '@/components/modal/modal'
import GameSystemDictionaryWords from '@/components/pages/game-systems/form/game-system-dictionary-words'
import { GameSystemFormInput } from '@/components/pages/game-systems/form/game-system-form-input'
import GameSystemName from '@/components/pages/game-systems/form/game-system-name'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const ModifyGameSystemModal = ({
  gameSystem,
  toggleModal,
  postSave
}: {
  gameSystem: GameSystem
  toggleModal: (e: any) => void
  postSave?: (gameSystem: GameSystem) => void
}) => {
  const { control, formState, handleSubmit } = useForm<GameSystemFormInput>({
    defaultValues: {
      name: gameSystem.name,
      dictionaryWords: gameSystem.dictionary_names.join('\n')
    }
  })
  const canSubmit: boolean = !formState.isSubmitting

  const save = useCallback(
    async (data: GameSystemFormInput) => {
      const name = data.name.trim()
      const dictionaryNames =
        data.dictionaryWords.trim().length <= 0
          ? []
          : data.dictionaryWords.trim().split('\n')
      // シナリオ名そのものも検索用ワードに含める
      if (!dictionaryNames.some((n) => n === name)) {
        dictionaryNames.unshift(name)
      }

      return await putGameSystem({
        id: gameSystem.id,
        name,
        dictionary_names: dictionaryNames
      })
    },
    [postGameSystem]
  )

  const existsGameSystem = useCallback(
    async (name: string) => {
      const gameSystems = await searchGameSystems({
        name
      })
      return gameSystems.list.some(
        (s) => s.name === name && s.id !== gameSystem.id
      )
    },
    [searchGameSystems]
  )

  const onSubmit: SubmitHandler<GameSystemFormInput> = useCallback(
    async (data) => {
      const gameSystem = await save(data)
      if (postSave) postSave(gameSystem)
    },
    [save]
  )

  // Enter押下で登録させない
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  return (
    <Modal close={toggleModal} hideFooter>
      <>
        <h2>シナリオ製作者編集</h2>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
            <div className='my-6'>
              <FormLabel label='ゲームシステム名' required />
              <GameSystemName
                control={control}
                existsGameSystem={existsGameSystem}
              />
            </div>
            <div className='my-6'>
              <FormLabel label='検索用ワード（改行区切り）' />
              <GameSystemDictionaryWords control={control} />
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
export default ModifyGameSystemModal
