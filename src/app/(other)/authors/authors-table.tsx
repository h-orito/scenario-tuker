'use client'

import { useAuth } from '@/components/auth/use-auth'
import PrimaryButton from '@/components/button/primary-button'
import { Filter } from '@/components/table/header'
import PaginationFooter from '@/components/table/pagination-footer'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Cell,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  useReactTable
} from '@tanstack/react-table'
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import ModifyAuthorModal from './modify-author'

const AuthorNameColumn = ({ cell }: { cell: Cell<Author, unknown> }) => {
  const author = cell.row.original
  return (
    <td key={cell.id} className='td text-left'>
      <Link href={`/authors/${author.id}`}>{author.name}</Link>
    </td>
  )
}

const EditColumn = ({
  cell,
  reload
}: {
  cell: Cell<Author, unknown>
  reload: () => void
}) => {
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
    <td className='w-8 td text-center'>
      <PrimaryButton
        className='py-1'
        click={() => openModifyModal(cell.row.original)}
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
  )
}

type Props = {
  authors: Author[]
  reload: () => void
}

const AuthorsTable = ({ authors, reload }: Props) => {
  const columns: ColumnDef<Author, any>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'シナリオ製作者名',
        cell: ({ cell }) => <AuthorNameColumn cell={cell} />,
        sortingFn: (rowA: Row<Author>, rowB: Row<Author>) => {
          return rowA.original.name.localeCompare(rowB.original.name)
        },
        filterFn: (row: Row<Author>, _: string, filterValue: string) => {
          return row.original.name.includes(filterValue)
        }
      },
      {
        accessorKey: 'edit',
        header: '編集',
        cell: ({ cell }) => <EditColumn cell={cell} reload={reload} />,
        enableColumnFilter: false
      }
    ],
    []
  )
  const table = useReactTable<Author>({
    data: authors,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10
      }
    }
  })

  return (
    <div>
      <table className='w-full table-auto border-collapse border border-slate-300 text-xs'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className='bg-gray-100 px-2 py-2 text-left'>
                  {header.isPlaceholder ? null : (
                    <>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <Filter
                        column={header.column}
                        disabled={!header.column.getCanFilter()}
                      />
                    </>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className='border-y border-slate-300 px-2 py-1 text-left'
              >
                該当するデータがありません
              </td>
            </tr>
          ) : (
            table
              .getRowModel()
              .rows.map((row) => (
                <tr key={row.id}>
                  {row
                    .getVisibleCells()
                    .map((cell) =>
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                </tr>
              ))
          )}
        </tbody>
        {authors.length > 0 && (
          <tfoot>
            <tr>
              <th colSpan={columns.length} className='bg-gray-100 px-2 py-2'>
                <PaginationFooter table={table} />
              </th>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}

export default AuthorsTable
