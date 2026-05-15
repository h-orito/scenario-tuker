'use client'

import { useAuth } from '@/components/auth/use-auth'
import DangerButton from '@/components/button/danger-button'
import PrimaryButton from '@/components/button/primary-button'
import useModalState from '@/components/modal/modal-state'
import {
  DisplayRuleBook,
  RuleBooksTableColumn,
  baseRuleBooksTableColumns,
  convertToDisplayRuleBooks
} from '@/components/pages/rule-books/rule-books-table'
import { Filter } from '@/components/table/header'
import PaginationFooter from '@/components/table/pagination-footer'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Cell,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useMemo } from 'react'
import DeleteRuleBookModal from './delete-rule-book'
import ModifyRuleBookModal from './modify-rule-book'

type Props = {
  ruleBooks: RuleBookResponse[]
  reload: () => void
}

const RuleBooksTable = ({ ruleBooks, reload }: Props) => {
  const displayRuleBooks = useMemo(() => {
    return convertToDisplayRuleBooks(ruleBooks)
  }, [convertToDisplayRuleBooks, ruleBooks])

  const columns: ColumnDef<DisplayRuleBook, any>[] = useMemo(() => {
    const list = baseRuleBooksTableColumns.concat({
      accessorKey: 'editors',
      header: '編集',
      cell: ({ cell }) => <EditColumn cell={cell} reload={reload} />,
      enableColumnFilter: false
    })
    return list
  }, [])

  const table = useReactTable<DisplayRuleBook>({
    data: displayRuleBooks,
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
      <div className='w-full overflow-x-scroll'>
        <table className='table whitespace-nowrap'>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} />
                          </div>
                        ) : null}
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
                <td colSpan={columns.length} className='td text-left'>
                  該当するデータがありません
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id}>
                    {row
                      .getVisibleCells()
                      .map((cell) =>
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      {displayRuleBooks.length > 0 && (
        <div className='border-x border-b border-slate-300 px-2 py-2 bg-gray-100 text-xs'>
          <PaginationFooter table={table} />
        </div>
      )}
    </div>
  )
}

type EditColumnProps = {
  cell: Cell<DisplayRuleBook, unknown>
  reload: (() => void) | undefined
}

const EditColumn = ({ cell, reload }: EditColumnProps) => {
  const ruleBook = cell.row.original

  // 編集
  const [
    isShowModifyModal,
    openModifyModal,
    closeModifyModal,
    toggleModifyModal
  ] = useModalState()
  const handlePostSave = async (ruleBook: RuleBookResponse) => {
    reload && (await reload())
    closeModifyModal()
  }

  // 削除系
  const [
    isShowDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    toggleDeleteModal
  ] = useModalState()
  const handlePostDelete = async () => {
    reload && (await reload())
    closeDeleteModal()
  }

  const canModify = useAuth().isSignedIn

  return (
    <RuleBooksTableColumn key={cell.id} cell={cell} className='w-8'>
      <PrimaryButton
        className='py-1'
        click={openModifyModal}
        disabled={!canModify}
      >
        <FontAwesomeIcon icon={faPencil} />
      </PrimaryButton>
      {isShowModifyModal && (
        <ModifyRuleBookModal
          ruleBook={ruleBook!}
          toggleModal={toggleModifyModal}
          postSave={handlePostSave}
        />
      )}
      <DangerButton
        className='ml-1 py-1'
        click={openDeleteModal}
        disabled={!canModify}
      >
        <FontAwesomeIcon icon={faTrash} />
      </DangerButton>
      {isShowDeleteModal && (
        <DeleteRuleBookModal
          ruleBook={ruleBook}
          toggleModal={toggleDeleteModal}
          postDelete={handlePostDelete}
        />
      )}
    </RuleBooksTableColumn>
  )
}

export default RuleBooksTable
