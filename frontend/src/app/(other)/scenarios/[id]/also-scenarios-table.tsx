'use client'

import {
  AuthorsColumnDef,
  convertToDisplayScenarios,
  DisplayScenario,
  GameMasterColumnDef,
  GameSystemsColumnDef,
  ParticipateCountColumnDef,
  PlayerNumColumnDef,
  RequiredHoursColumnDef,
  ScenarioNameColumnDef,
  TypeColumnDef
} from '@/components/pages/scenarios/scenarios-table'
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
  scenarios: ScenarioResponse[]
}

const AlsoScenariosTable = (props: Props) => {
  const { scenarios } = props

  const displayScenarios = useMemo(() => {
    return convertToDisplayScenarios(scenarios)
  }, [convertToDisplayScenarios, scenarios])

  const columns: ColumnDef<DisplayScenario, any>[] = [
    ScenarioNameColumnDef,
    TypeColumnDef,
    GameSystemsColumnDef,
    AuthorsColumnDef,
    GameMasterColumnDef,
    PlayerNumColumnDef,
    RequiredHoursColumnDef,
    ParticipateCountColumnDef
  ]

  const table = useReactTable<DisplayScenario>({
    data: displayScenarios,
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
                const cells = row.getAllCells()
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
      {displayScenarios.length > 0 && (
        <div className='border-x border-b border-slate-300 px-2 py-2 bg-gray-100 text-xs'>
          <PaginationFooter table={table} />
        </div>
      )}
    </div>
  )
}

export default AlsoScenariosTable
