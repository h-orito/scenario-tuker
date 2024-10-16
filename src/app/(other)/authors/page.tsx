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
import { fetchAuthors, searchAuthors } from '@/components/api/author-api'
import SecondaryButton from '@/components/button/scondary-button'
import SubmitButton from '@/components/button/submit-button'
import InputText from '@/components/form/input-text'
import { faPencil, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PrimaryButton from '@/components/button/primary-button'
import CreateAuthorModal from './create-author'
import { useRouter } from 'next/navigation'
import ModifyAuthorModal from './modify-author'
import PaginationFooter from '@/components/table/pagination-footer'
import { useAuth } from '@/components/auth/use-auth'

const AuthorPage = () => {
  const [authors, setAuthors] = useState<Author[]>([])
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)
  const openCreateModal = () => setIsOpenCreateModal(true)
  const toggleCreateModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenCreateModal(!isOpenCreateModal)
    }
  }
  const router = useRouter()
  const postCreate = useCallback((author: Author) => {
    router.push(`/authors/${author.id}`)
  }, [])

  const searchRef = useRef({} as SearchAuthorsHandle)
  const reload = async () => searchRef.current.search()

  return (
    <div>
      <title>Scenario Tuker | シナリオ制作者一覧</title>
      <h1>シナリオ製作者一覧</h1>
      <SearchAuthors ref={searchRef} setAuthors={setAuthors} />
      <div className='my-4 flex justify-end'>
        <PrimaryButton click={openCreateModal}>
          <FontAwesomeIcon icon={faPlus} className='mr-2 h-4' />
          追加
        </PrimaryButton>
        {isOpenCreateModal && (
          <CreateAuthorModal
            toggleModal={toggleCreateModal}
            postSave={postCreate}
          />
        )}
      </div>
      <AuthorsTable authors={authors} reload={reload} />
      <div className='mt-4'>
        <Link href='/'>
          <SecondaryButton>トップページ</SecondaryButton>
        </Link>
      </div>
    </div>
  )
}

export default AuthorPage

interface FormInput {
  name: string
}

interface SearchAuthorsHandle {
  search: () => void
}

interface SearchAuthorsProps {
  setAuthors: Dispatch<SetStateAction<Author[]>>
}

const SearchAuthors = forwardRef<SearchAuthorsHandle, SearchAuthorsProps>(
  (props: SearchAuthorsProps, ref: ForwardedRef<SearchAuthorsHandle>) => {
    const { setAuthors } = props
    const { control, formState, handleSubmit, getValues } = useForm<FormInput>({
      defaultValues: {
        name: ''
      }
    })
    const canSubmit: boolean = !formState.isSubmitting

    const search = useCallback(
      async (name: string) => {
        if (name == null || name === '') {
          return await fetchAuthors()
        } else {
          return await searchAuthors({
            name: name
          })
        }
      },
      [fetchAuthors, searchAuthors]
    )

    const onSubmit: SubmitHandler<FormInput> = useCallback(
      async (data) => {
        const res = await search(data.name)
        setAuthors(res.list)
      },
      [search]
    )

    useImperativeHandle(ref, () => ({
      search() {
        reload
      }
    }))

    useEffect(() => {
      reload()
    }, [])

    const reload = async () => {
      const res = await search(getValues().name)
      setAuthors(res.list)
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
                placeholder='シナリオ製作者名'
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

type AuthorsTableProps = {
  authors: Author[]
  reload: () => void
}

const AuthorsTable = ({ authors, reload }: AuthorsTableProps) => {
  const columns: ColumnDef<Author, any>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'シナリオ製作者名'
      }
    ],
    []
  )
  const table = useReactTable<Author>({
    data: authors,
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

  const [modifyAuthor, setModifyAuthor] = useState<Author | null>(null)
  const [isOpenModifyModal, setIsOpenModifyModal] = useState(false)
  const openModifyModal = (author: Author) => {
    setModifyAuthor(author)
    setIsOpenModifyModal(true)
  }
  const toggleModifyModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenModifyModal(!isOpenModifyModal)
    }
  }

  const postUpdate = useCallback(async (author: Author) => {
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
                    <Link href={`/authors/${cell.row.original.id}`}>
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
                    <ModifyAuthorModal
                      toggleModal={toggleModifyModal}
                      postSave={postUpdate}
                      author={modifyAuthor!}
                    />
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
        {authors.length > 0 && (
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
