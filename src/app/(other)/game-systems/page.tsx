'use client'

import {
  Dispatch,
  ForwardedRef,
  forwardRef,
  SetStateAction,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import Link from 'next/link'
import { SubmitHandler, useForm } from 'react-hook-form'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import {
  fetchGameSystems,
  searchGameSystems
} from '@/components/api/game-system-api'
import SecondaryButton from '@/components/button/scondary-button'
import SubmitButton from '@/components/button/submit-button'
import InputText from '@/components/form/input-text'
import { faPencil, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PrimaryButton from '@/components/button/primary-button'
import { useRouter } from 'next/navigation'
import PaginationFooter from '@/components/table/pagination-footer'
import { useAuth } from '@/components/auth/use-auth'
import CreateGameSystemModal from './create-game-system'
import ModifyGameSystemModal from './modify-game-system'

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

type GameSystemsTableProps = {
  gameSystems: GameSystem[]
  reload: () => void
}

const GameSystemsTable = ({ gameSystems, reload }: GameSystemsTableProps) => {
  const columns: ColumnDef<GameSystem, any>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'ゲームシステム名'
      }
    ],
    []
  )
  const table = useReactTable<GameSystem>({
    data: gameSystems,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10
      }
    }
  })

  const [modifyGameSystem, setModifyGameSystem] = useState<GameSystem | null>(
    null
  )
  const [isOpenModifyModal, setIsOpenModifyModal] = useState(false)
  const openModifyModal = (gameSystem: GameSystem) => {
    setModifyGameSystem(gameSystem)
    setIsOpenModifyModal(true)
  }
  const toggleModifyModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenModifyModal(!isOpenModifyModal)
    }
  }

  const postUpdate = useCallback(async (gameSystem: GameSystem) => {
    setIsOpenModifyModal(false)
    await reload()
  }, [])

  const modifiable = useAuth().isSignedIn

  return (
    <div>
      <table className='w-full table-auto border-collapse border border-slate-300 text-xs'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className='bg-gray-100 px-4 py-2 text-left'>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
              <th className='w-8 bg-gray-100 px-4 py-2 text-center'>編集</th>
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={2}
                className='border-y border-slate-300 px-4 py-2 text-left'
              >
                該当するデータがありません
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className='border-y border-slate-300 px-4 py-2 text-left'
                  >
                    <Link href={`/game-systems/${cell.row.original.id}`}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Link>
                  </td>
                ))}
                <td className='w-8 border-y border-slate-300 px-4 py-2 text-center'>
                  <PrimaryButton
                    click={() => openModifyModal(row.original)}
                    disabled={!modifiable}
                  >
                    <FontAwesomeIcon icon={faPencil} />
                  </PrimaryButton>
                  {isOpenModifyModal && (
                    <ModifyGameSystemModal
                      toggleModal={toggleModifyModal}
                      postSave={postUpdate}
                      gameSystem={modifyGameSystem!}
                    />
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
        {gameSystems.length > 0 && (
          <tfoot>
            <tr>
              <th colSpan={2} className='bg-gray-100 px-4 py-2'>
                <PaginationFooter table={table} />
              </th>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}
