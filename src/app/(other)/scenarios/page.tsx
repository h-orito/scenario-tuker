'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ScenarioType } from '@/@types/scenario-type'
import { fetchScenarios, searchScenarios } from '@/components/api/scenario-api'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/scondary-button'
import SubmitButton from '@/components/button/submit-button'
import InputCheckbox from '@/components/form/input-checkbox'
import InputNumber from '@/components/form/input-number'
import InputText from '@/components/form/input-text'
import RadioGroup from '@/components/form/radio-group'
import ScenariosTable from '@/app/(other)/scenarios/scenarios-table'
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CreateScenarioModal from './create-scenario'

const ScenariosPage = () => {
  const [scenarios, setScenarios] = useState<ScenarioResponse[]>([])
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)
  const openCreateModal = () => setIsOpenCreateModal(true)
  const toggleCreateModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenCreateModal(!isOpenCreateModal)
    }
  }
  const router = useRouter()
  const postCreate = useCallback((scenario: ScenarioResponse) => {
    router.push(`/scenarios/${scenario.id}`)
  }, [])

  const searchRef = useRef({} as SearchScenariosHandle)
  const search = async () => searchRef.current.search()

  return (
    <div>
      <title>Scenario Tuker | シナリオ一覧</title>
      <h1>シナリオ一覧</h1>
      <SearchScenarios ref={searchRef} setScenarios={setScenarios} />
      <div className='my-4 flex justify-end'>
        <PrimaryButton click={openCreateModal}>
          <FontAwesomeIcon icon={faPlus} className='mr-2 h-4' />
          追加
        </PrimaryButton>
        {isOpenCreateModal && (
          <CreateScenarioModal
            scenarioType={searchRef.current.getSearchType()}
            toggleModal={toggleCreateModal}
            postSave={postCreate}
          />
        )}
      </div>
      <ScenariosTable scenarios={scenarios} reload={search} />
      <div className='mt-4'>
        <Link href='/'>
          <SecondaryButton>トップページ</SecondaryButton>
        </Link>
      </div>
    </div>
  )
}

export default ScenariosPage

interface FormInput {
  name: string
  gameSystem: string
  author: string
  playerCount: string
}

interface SearchScenariosHandle {
  search: () => void
  getSearchType: () => string
}

interface SearchScenariosProps {
  setScenarios: Dispatch<SetStateAction<ScenarioResponse[]>>
}

const SearchScenarios = forwardRef<SearchScenariosHandle, SearchScenariosProps>(
  ({ setScenarios }, ref) => {
    const params = useSearchParams()
    const type = params.get('type') || ScenarioType.MurderMystery.value
    const [scenarioType, setScenarioType] = useState(type)
    const [containPlayerCountEmpty, setContainPlayerCountEmpty] =
      useState(false)
    const { control, formState, handleSubmit, getValues, setValue } =
      useForm<FormInput>({
        defaultValues: {
          name: '',
          gameSystem: '',
          author: '',
          playerCount: ''
        }
      })
    const isEmptyQuery = useMemo(() => {
      const values = getValues()
      return (
        values.name === '' &&
        values.gameSystem === '' &&
        values.author === '' &&
        scenarioType === '' &&
        values.playerCount == null
      )
    }, [type, getValues])
    const canSubmit: boolean = !formState.isSubmitting

    const search = useCallback(
      async (data: FormInput) => {
        if (isEmptyQuery) {
          return await fetchScenarios()
        } else {
          return await searchScenarios({
            name: data.name,
            game_system_id: null,
            game_system_name: data.gameSystem,
            author_name: data.author,
            type: scenarioType === '' ? null : scenarioType,
            player_num:
              data.playerCount === '' ? null : parseInt(data.playerCount),
            player_num_empty: containPlayerCountEmpty
          })
        }
      },
      [fetchScenarios, searchScenarios, scenarioType, containPlayerCountEmpty]
    )

    const onSubmit: SubmitHandler<FormInput> = useCallback(
      async (data) => {
        const res = await search(data)
        setScenarios(res.list)
      },
      [search]
    )

    const reload = async () => {
      const res = await search(getValues())
      setScenarios(res.list)
    }

    useImperativeHandle(ref, () => ({
      search: reload,
      getSearchType: () => scenarioType
    }))

    useEffect(() => {
      reload()
    }, [])

    const setPlayerCount = (value: string) => {
      setValue('playerCount', value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
      }
    }

    return (
      <div className='my-2 rounded bg-gray-200 p-2 text-center md:my-5 md:p-5'>
        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
          <label className='field-label'>検索条件</label>
          <div className='field my-2'>
            <RadioGroup
              name='scenario-type'
              candidates={[
                ...Object.values(ScenarioType).map((type) => ({
                  label: type.label,
                  value: type.value
                })),
                { label: '両方', value: '' }
              ]}
              selected={scenarioType}
              setSelected={setScenarioType}
            />
          </div>
          <div className='field my-2'>
            <InputText
              control={control}
              name='name'
              placeholder='シナリオ名'
              className='w-full'
            />
          </div>
          <div className='field my-2'>
            <InputText
              control={control}
              name='gameSystem'
              placeholder='ゲームシステム名'
              className='w-full'
            />
          </div>
          <div className='field my-2'>
            <InputText
              control={control}
              name='author'
              placeholder='シナリオ製作者名'
              className='w-full'
            />
          </div>
          <div className='field my-2'>
            <div className='flex gap-2'>
              <InputNumber
                name='playerCount'
                control={control}
                setValue={setPlayerCount}
                step={1}
                min={0}
                placeholder='PL人数'
              />
              <InputCheckbox
                name='playerCountEmpty'
                label='PL人数未登録も含む'
                className='flex-1'
                value={containPlayerCountEmpty}
                setSelected={() =>
                  setContainPlayerCountEmpty(!containPlayerCountEmpty)
                }
              />
            </div>
          </div>
          <div className='my-4'>
            <div>
              <SubmitButton disabled={!canSubmit}>
                <FontAwesomeIcon icon={faSearch} className='mr-2 h-4' />
                検索
              </SubmitButton>
            </div>
          </div>
        </form>
      </div>
    )
  }
)
