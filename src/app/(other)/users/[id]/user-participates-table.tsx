'use client'

import { ScenarioType } from '@/@types/scenario-type'
import {
  DisplayParticipate,
  GameMasterNameColumnDef,
  GameSystemColumnDef,
  ImpressionColumnDef,
  MemoColumnDef,
  ParticipatesTableColumn,
  PlayerNamesColumnDef,
  PlayerNumNameColumnDef,
  RequiredHoursColumnDef,
  RoleColumnDef,
  RuleBooksColumnDef,
  ScenarioNameColumnDef,
  TermNameColumnDef,
  convertToDisplayParticipates
} from '@/components/pages/participates/participates-table'
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
import ParticipateDeleteButton from './participate-delete-button'
import ParticipateModifyButton from './participate-modify-button'

type Props = {
  canModify: boolean
  participates: ParticipateResponse[]
  type: ScenarioType
  reload: () => void
}

const UserParticipatesTable = ({
  canModify,
  participates,
  type,
  reload
}: Props) => {
  const displayParticipates = useMemo(() => {
    return convertToDisplayParticipates(participates)
  }, [convertToDisplayParticipates, participates])

  const columns: ColumnDef<DisplayParticipate, any>[] = useMemo(() => {
    let columns = [ScenarioNameColumnDef]
    if (type === ScenarioType.Trpg) {
      columns = columns.concat([GameSystemColumnDef, RuleBooksColumnDef])
    }
    columns = columns.concat([
      RoleColumnDef,
      TermNameColumnDef,
      RequiredHoursColumnDef,
      PlayerNumNameColumnDef,
      GameMasterNameColumnDef,
      PlayerNamesColumnDef,
      MemoColumnDef,
      ImpressionColumnDef
    ])
    if (canModify) {
      columns = columns.concat({
        accessorKey: 'edit',
        header: '編集',
        cell: ({ cell }) => <EditColumn cell={cell} reload={reload} />,
        enableColumnFilter: false
      })
    }
    return columns
  }, [type, canModify])

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

export default UserParticipatesTable

type EditColumnProps = {
  cell: Cell<DisplayParticipate, unknown>
  reload: () => void
}

const EditColumn = ({ cell, reload }: EditColumnProps) => {
  const participate = cell.row.original
  return (
    <ParticipatesTableColumn cell={cell} className='w-8'>
      <div className='flex gap-1'>
        <ParticipateModifyButton
          className='py-1'
          participate={participate}
          scenarioType={
            participate.scenario.type === ScenarioType.MurderMystery.value
              ? ScenarioType.MurderMystery
              : ScenarioType.Trpg
          }
          reload={reload}
        />
        <ParticipateDeleteButton
          className='py-1'
          participate={participate}
          reload={reload}
        />
      </div>
    </ParticipatesTableColumn>
  )
}
