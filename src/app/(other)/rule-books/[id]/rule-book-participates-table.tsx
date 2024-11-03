'use client'

import {
  DisplayParticipate,
  GameMasterNameColumnDef,
  ImpressionColumnDef,
  MemoColumnDef,
  PlayerNamesColumnDef,
  PlayerNumNameColumnDef,
  RequiredHoursColumnDef,
  RoleColumnDef,
  ScenarioNameColumnDef,
  TermNameColumnDef,
  UserColumnDef,
  convertToDisplayParticipates
} from '@/components/pages/participates/participates-table'
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
  participates: ParticipateResponse[]
}

const RuleBookParticipatesTable = ({ participates }: Props) => {
  const displayParticipates = useMemo(() => {
    return convertToDisplayParticipates(participates)
  }, [convertToDisplayParticipates, participates])

  const columns: ColumnDef<DisplayParticipate, any>[] = useMemo(() => {
    return [
      ScenarioNameColumnDef,
      UserColumnDef,
      RoleColumnDef,
      TermNameColumnDef,
      RequiredHoursColumnDef,
      PlayerNumNameColumnDef,
      GameMasterNameColumnDef,
      PlayerNamesColumnDef,
      MemoColumnDef,
      ImpressionColumnDef
    ]
  }, [])

  const table = useReactTable<DisplayParticipate>({
    data: displayParticipates,
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
              const cells = row.getAllCells()
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
        {displayParticipates.length > 0 && (
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

export default RuleBookParticipatesTable
