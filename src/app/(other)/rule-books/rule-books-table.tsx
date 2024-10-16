import { useAuth } from '@/components/auth/use-auth'
import DangerButton from '@/components/button/danger-button'
import PrimaryButton from '@/components/button/primary-button'
import {
  DisplayRuleBook,
  RuleBookTableGameSystemColumn,
  RuleBookTableRuleBookNameColumn,
  RuleBooksTableColumn,
  RuleBooksTableSimpleColumn,
  baseRuleBooksTableColumns,
  convertToDisplayRuleBooks
} from '@/components/pages/rule-books/rule-books-table'
import PaginationFooter from '@/components/table/pagination-footer'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Cell,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
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
      header: '編集'
    })
    return list
  }, [])

  const table = useReactTable<DisplayRuleBook>({
    data: displayRuleBooks,
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

  return (
    <div className='w-full overflow-x-scroll'>
      <table className='table whitespace-nowrap'>
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
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className='border-y border-slate-300 px-4 py-2 text-left'
              >
                該当するデータがありません
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => {
              const cells = row.getAllCells()
              return (
                <tr key={row.id}>
                  <RuleBookTableRuleBookNameColumn cell={cells[0]} />
                  <RuleBookTableGameSystemColumn cell={cells[1]} />
                  <RuleBooksTableSimpleColumn cell={cells[2]} />
                  <EditColumn cell={cells[3]} reload={reload} />
                </tr>
              )
            })
          )}
        </tbody>
        {displayRuleBooks.length > 0 && (
          <tfoot>
            <tr>
              <th colSpan={columns.length} className='bg-gray-100 px-4 py-2'>
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
  const [isOpenModifyModal, setIsOpenModifyModal] = useState(false)
  const openModifyModal = (scenario: RuleBookResponse) => {
    setModifyRuleBook(scenario)
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

  const canModify = useAuth().isSignedIn

  return (
    <RuleBooksTableColumn cell={cell} className='flex gap-1'>
      <PrimaryButton
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
      <DangerButton click={() => {}} disabled={!canModify}>
        <FontAwesomeIcon icon={faTrash} />
      </DangerButton>
    </RuleBooksTableColumn>
  )
}

export default RuleBooksTable
