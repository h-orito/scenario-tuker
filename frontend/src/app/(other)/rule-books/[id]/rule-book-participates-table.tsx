'use client'

import { fetchRuleBookParticipates } from '@/components/api/rule-book-api'
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
import PaginationFooter from '@/components/table/pagination-footer'
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  ruleBookId: number
  initial: ParticipatesResponse
}

const RuleBookParticipatesTable = ({ ruleBookId, initial }: Props) => {
  const [participates, setParticipates] = useState<ParticipatesResponse>(initial)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const fetch = async () => {
      const res = await fetchRuleBookParticipates(
        ruleBookId,
        pagination.pageIndex + 1,
        pagination.pageSize
      )
      setParticipates(res)
    }
    fetch()
  }, [ruleBookId, pagination])

  const displayParticipates = useMemo(() => {
    return convertToDisplayParticipates(participates.list)
  }, [participates])

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
    manualPagination: true,
    pageCount: participates.all_page_count,
    rowCount: participates.all_record_count,
    // サーバーサイドページングのためページ内ソート・フィルタは無効
    enableSorting: false,
    enableColumnFilters: false,
    onPaginationChange: (updater) => {
      setPagination((old) => {
        const next = typeof updater === 'function' ? updater(old) : updater
        // ページサイズ変更時は1ページ目に戻す
        if (next.pageSize !== old.pageSize) return { ...next, pageIndex: 0 }
        return next
      })
    },
    state: {
      pagination
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
      {participates.all_record_count > 0 && (
        <div className='border-x border-b border-slate-300 px-2 py-2 bg-gray-100 text-xs'>
          <p className='mb-1'>全{participates.all_record_count}件</p>
          <PaginationFooter table={table} />
        </div>
      )}
    </div>
  )
}

export default RuleBookParticipatesTable
