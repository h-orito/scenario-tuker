import { useAuth } from '@/components/auth/use-auth'
import DangerButton from '@/components/button/danger-button'
import PrimaryButton from '@/components/button/primary-button'
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
import { useMemo, useState } from 'react'
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
    <div className='w-full overflow-x-scroll'>
      <table className='table whitespace-nowrap'>
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
              <td
                colSpan={columns.length}
                className='border-y border-slate-300 px-2 py-1 text-left'
              >
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
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                </tr>
              )
            })
          )}
        </tbody>
        {displayRuleBooks.length > 0 && (
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

type EditColumnProps = {
  cell: Cell<DisplayRuleBook, unknown>
  reload: (() => void) | undefined
}

const EditColumn = ({ cell, reload }: EditColumnProps) => {
  const ruleBook = cell.row.original
  const [modifyRuleBook, setModifyRuleBook] = useState<RuleBookResponse | null>(
    null
  )
  // 編集
  const [isOpenModifyModal, setIsOpenModifyModal] = useState(false)
  const openModifyModal = (ruleBook: RuleBookResponse) => {
    setModifyRuleBook(ruleBook)
    setIsOpenModifyModal(true)
  }
  const toggleModifyModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenModifyModal(!isOpenModifyModal)
    }
  }
  const handlePostSave = async (ruleBook: RuleBookResponse) => {
    reload && (await reload())
    setIsOpenModifyModal(false)
  }
  // 削除系
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
  const openDeleteModal = (ruleBook: RuleBookResponse) => {
    setModifyRuleBook(ruleBook)
    setIsOpenDeleteModal(true)
  }
  const toggleDeleteModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenDeleteModal(!isOpenDeleteModal)
    }
  }
  const handlePostDelete = async () => {
    reload && (await reload())
    setIsOpenDeleteModal(false)
  }

  const canModify = useAuth().isSignedIn

  return (
    <RuleBooksTableColumn cell={cell} className='w-8'>
      <PrimaryButton
        className='py-1'
        click={() => openModifyModal(ruleBook)}
        disabled={!canModify}
      >
        <FontAwesomeIcon icon={faPencil} />
      </PrimaryButton>
      {isOpenModifyModal && (
        <ModifyRuleBookModal
          ruleBook={modifyRuleBook!}
          toggleModal={toggleModifyModal}
          postSave={handlePostSave}
        />
      )}
      <DangerButton
        className='ml-1 py-1'
        click={() => openDeleteModal(ruleBook)}
        disabled={!canModify}
      >
        <FontAwesomeIcon icon={faTrash} />
      </DangerButton>
      {isOpenDeleteModal && (
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
