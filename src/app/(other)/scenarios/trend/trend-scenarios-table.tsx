'use client'

import { ScenarioType } from '@/@types/scenario-type'
import {
  AuthorsColumn,
  AuthorsColumnDef,
  convertToDisplayScenarios,
  DisplayScenario,
  GameMasterColumnDef,
  GameSystemColumn,
  GameSystemColumnDef,
  ParticipateCountColumnDef,
  PlayerNumColumnDef,
  RequiredHoursColumnDef,
  ScenarioNameColumn,
  ScenarioNameColumnDef,
  ScenariosTableSimpleColumn
} from '@/components/pages/scenarios/scenarios-table'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useMemo } from 'react'
import PaginationFooter from '../../../../components/table/pagination-footer'

type Props = {
  scenarios: ScenarioResponse[]
  type: LabelValue
}

const TrendScenariosTable = ({ scenarios, type }: Props) => {
  const isTrpg = useMemo(() => type.value === ScenarioType.Trpg.value, [type])
  const displayScenarios = useMemo(() => {
    return convertToDisplayScenarios(scenarios)
  }, [convertToDisplayScenarios, scenarios])

  const columns: ColumnDef<DisplayScenario, any>[] = useMemo(() => {
    let list = [ScenarioNameColumnDef]
    if (isTrpg) {
      list = list.concat([GameSystemColumnDef])
    }
    return list.concat([
      AuthorsColumnDef,
      GameMasterColumnDef,
      PlayerNumColumnDef,
      RequiredHoursColumnDef,
      ParticipateCountColumnDef
    ])
  }, [type])

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
                <th key={header.id}>
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
              <td colSpan={columns.length} className='td text-left'>
                該当するデータがありません
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => {
              const cells = row.getAllCells()
              const baseIndex = isTrpg ? 1 : 0
              return (
                <tr key={row.id}>
                  <ScenarioNameColumn cell={cells[0]} />
                  {isTrpg && <GameSystemColumn cell={cells[1]} />}
                  <AuthorsColumn cell={cells[baseIndex + 1]} />
                  <ScenariosTableSimpleColumn cell={cells[baseIndex + 2]} />
                  <ScenariosTableSimpleColumn cell={cells[baseIndex + 3]} />
                  <ScenariosTableSimpleColumn cell={cells[baseIndex + 4]} />
                  <ScenariosTableSimpleColumn cell={cells[baseIndex + 5]} />
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

export default TrendScenariosTable
