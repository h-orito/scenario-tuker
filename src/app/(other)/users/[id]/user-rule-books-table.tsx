import {
  DisplayRuleBook,
  baseRuleBooksTableColumns,
  convertToDisplayRuleBooks
} from '@/components/pages/rule-books/rule-books-table'
import { Filter } from '@/components/table/header'
import PaginationFooter from '@/components/table/pagination-footer'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useMemo } from 'react'

type Props = {
  ruleBooks: RuleBookResponse[]
}

const UserRuleBooksTable = ({ ruleBooks }: Props) => {
  const displayRuleBooks = useMemo(() => {
    return convertToDisplayRuleBooks(ruleBooks)
  }, [convertToDisplayRuleBooks, ruleBooks])

  const columns: ColumnDef<DisplayRuleBook, any>[] = useMemo(() => {
    const list = baseRuleBooksTableColumns
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
                className='border-y border-slate-300 px-2 py-2 text-left'
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

export default UserRuleBooksTable
