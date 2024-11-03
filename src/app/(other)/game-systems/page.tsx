'use client'

import {
  fetchGameSystems,
  searchGameSystems
} from '@/components/api/game-system-api'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/scondary-button'
import SubmitButton from '@/components/button/submit-button'
import InputText from '@/components/form/input-text'
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Dispatch,
  ForwardedRef,
  forwardRef,
  SetStateAction,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import CreateGameSystemModal from './create-game-system'
import GameSystemsTable from './game-systems-table'

const GameSystemPage = () => {
  const [gameSystems, setGameSystems] = useState<GameSystem[]>([])
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)
  const openCreateModal = () => setIsOpenCreateModal(true)
  const toggleCreateModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenCreateModal(!isOpenCreateModal)
    }
  }
  const router = useRouter()
  const postCreate = useCallback((gameSystem: GameSystem) => {
    router.push(`/game-systems/${gameSystem.id}`)
  }, [])

  const searchRef = useRef({} as SearchGameSystemsHandle)
  const reload = async () => searchRef.current.search()

  return (
    <div>
      <title>Scenario Tuker | ゲームシステム一覧</title>
      <h1>ゲームシステム一覧</h1>
      <SearchGameSystems ref={searchRef} setGameSystems={setGameSystems} />
      <div className='my-4 flex justify-end'>
        <PrimaryButton click={openCreateModal}>
          <FontAwesomeIcon icon={faPlus} className='mr-2 h-4' />
          追加
        </PrimaryButton>
        {isOpenCreateModal && (
          <CreateGameSystemModal
            toggleModal={toggleCreateModal}
            postSave={postCreate}
          />
        )}
      </div>
      <GameSystemsTable gameSystems={gameSystems} reload={reload} />
      <div className='mt-4'>
        <Link href='/'>
          <SecondaryButton>トップページ</SecondaryButton>
        </Link>
      </div>
    </div>
  )
}

export default GameSystemPage

interface FormInput {
  name: string
}

interface SearchGameSystemsHandle {
  search: () => void
}

interface SearchGameSystemsProps {
  setGameSystems: Dispatch<SetStateAction<GameSystem[]>>
}

const SearchGameSystems = forwardRef<
  SearchGameSystemsHandle,
  SearchGameSystemsProps
>(
  (
    props: SearchGameSystemsProps,
    ref: ForwardedRef<SearchGameSystemsHandle>
  ) => {
    const { setGameSystems } = props
    const { control, formState, handleSubmit, getValues } = useForm<FormInput>({
      defaultValues: {
        name: ''
      }
    })
    const canSubmit: boolean = !formState.isSubmitting

    const search = useCallback(
      async (name: string) => {
        if (name == null || name === '') {
          return await fetchGameSystems()
        } else {
          return await searchGameSystems({
            name: name
          })
        }
      },
      [fetchGameSystems, searchGameSystems]
    )

    const onSubmit: SubmitHandler<FormInput> = useCallback(
      async (data) => {
        const res = await search(data.name)
        setGameSystems(res.list)
      },
      [search]
    )

    useImperativeHandle(ref, () => ({
      async search() {
        reload()
      }
    }))

    useEffect(() => {
      reload()
    }, [])

    const reload = async () => {
      const res = await search(getValues().name)
      setGameSystems(res.list)
    }

    return (
      <div className='my-2 rounded bg-gray-200 p-2 text-center md:my-5 md:p-5'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className='field-label'>検索条件</label>
          <div className='field my-2'>
            <div className='p-inputgroup'>
              <InputText
                control={control}
                name='name'
                placeholder='ゲームシステム名'
                className='w-full'
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
