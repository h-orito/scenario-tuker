'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import React, { useMemo } from 'react'
import {
  AuthorsColumn,
  baseScenarioTableColumns,
  convertToDisplayScenarios,
  DisplayScenario,
  GameSystemColumn,
  ScenarioNameColumn,
  ScenariosTableSimpleColumn
} from '@/components/pages/scenarios/scenarios-table'
import PaginationFooter from '@/components/table/pagination-footer'

type Props = {
  scenarios: ScenarioResponse[]
}

const GameSystemScenariosTable = (props: Props) => {
  const { scenarios } = props

  const displayScenarios = useMemo(() => {
    return convertToDisplayScenarios(scenarios)
  }, [convertToDisplayScenarios, scenarios])

  const columns: ColumnDef<DisplayScenario, any>[] = baseScenarioTableColumns

  const table = useReactTable<DisplayScenario>({
    data: displayScenarios,
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
                  <ScenarioNameColumn cell={cells[0]} />
                  <ScenariosTableSimpleColumn cell={cells[1]} />
                  <GameSystemColumn cell={cells[2]} />
                  <AuthorsColumn cell={cells[3]} />
                  <ScenariosTableSimpleColumn cell={cells[4]} />
                  <ScenariosTableSimpleColumn cell={cells[5]} />
                  <ScenariosTableSimpleColumn cell={cells[6]} />
                  <ScenariosTableSimpleColumn cell={cells[7]} />
                </tr>
              )
            })
          )}
        </tbody>
        {displayScenarios.length > 0 && (
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

export default GameSystemScenariosTable
