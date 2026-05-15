import {
  DisplayRuleBook,
  RuleBooksTableColumn,
  baseRuleBooksTableColumns,
  convertToDisplayRuleBooks
} from '@/components/pages/rule-books/rule-books-table'
import { Filter } from '@/components/table/header'
import PaginationFooter from '@/components/table/pagination-footer'
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
import UserRuleBookDeleteButton from './user-rule-book-delete-button'

type Props = {
  canModify: boolean
  ruleBooks: RuleBookResponse[]
  reload: () => void
}

const UserRuleBooksTable = ({ canModify, ruleBooks, reload }: Props) => {
  const displayRuleBooks = useMemo(() => {
    return convertToDisplayRuleBooks(ruleBooks)
  }, [convertToDisplayRuleBooks, ruleBooks])

  const columns: ColumnDef<DisplayRuleBook, any>[] = useMemo(() => {
    const list = baseRuleBooksTableColumns
    if (canModify) {
      return list.concat({
        accessorKey: 'edit',
        header: '編集',
        cell: ({ cell }) => <EditColumn cell={cell} reload={reload} />,
        enableColumnFilter: false
      })
    }
    return list
  }, [canModify])

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

export default UserRuleBooksTable

type EditColumnProps = {
  cell: Cell<DisplayRuleBook, unknown>
  reload: () => void
}

const EditColumn = ({ cell, reload }: EditColumnProps) => {
  const ruleBook = cell.row.original
  return (
    <RuleBooksTableColumn cell={cell} className='w-8'>
      <UserRuleBookDeleteButton
        className='py-1'
        ruleBook={ruleBook}
        reload={reload}
      />
    </RuleBooksTableColumn>
  )
}
