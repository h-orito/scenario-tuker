'use client'

import { ScenarioType } from '@/@types/scenario-type'
import {
  AuthorsColumnDef,
  convertToDisplayScenarios,
  DisplayScenario,
  GameMasterColumnDef,
  GameSystemColumnDef,
  PlayerNumColumnDef,
  RequiredHoursColumnDef,
  ScenarioNameColumnDef,
  ScenariosTableColumn
} from '@/components/pages/scenarios/scenarios-table'
import { Filter } from '@/components/table/header'
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
import PaginationFooter from '../../../../components/table/pagination-footer'
import UserScenarioDeleteButton from './user-scenario-delete-button'

type Props = {
  scenarios: ScenarioResponse[]
  canModify: boolean
  type: ScenarioType
  reload: () => void
}

const UserScenariosTable = (props: Props) => {
  const { scenarios, type, canModify, reload } = props

  const displayScenarios = useMemo(() => {
    return convertToDisplayScenarios(scenarios)
  }, [convertToDisplayScenarios, scenarios])

  const columns: ColumnDef<DisplayScenario, any>[] = useMemo(() => {
    let base = [ScenarioNameColumnDef]
    if (type === ScenarioType.Trpg) {
      base = base.concat(GameSystemColumnDef)
    }
    base = base.concat([
      AuthorsColumnDef,
      GameMasterColumnDef,
      PlayerNumColumnDef,
      RequiredHoursColumnDef
    ])
    if (canModify) {
      return base.concat({
        accessorKey: 'edit',
        header: '編集',
        cell: ({ cell }) => <EditColumn cell={cell} reload={reload} />,
        enableColumnFilter: false
      })
    }
    return base
  }, [type, canModify])

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

export default UserScenariosTable

type EditColumnProps = {
  cell: Cell<DisplayScenario, unknown>
  reload: () => void
}

const EditColumn = ({ cell, reload }: EditColumnProps) => {
  const scenario = cell.row.original
  return (
    <ScenariosTableColumn cell={cell} className='w-8'>
      <UserScenarioDeleteButton
        className='py-1'
        scenario={scenario}
        reload={reload}
      />
    </ScenariosTableColumn>
  )
}
