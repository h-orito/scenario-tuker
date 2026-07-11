'use client'

import { ScenarioType } from '@/@types/scenario-type'
import { fetchScenarioParticipates } from '@/components/api/scenario-api'
import {
  DisplayParticipate,
  GameMasterNameColumnDef,
  ImpressionColumnDef,
  MemoColumnDef,
  PlayerNamesColumnDef,
  PlayerNumNameColumnDef,
  RequiredHoursColumnDef,
  RoleColumnDef,
  RuleBooksColumnDef,
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
  scenarioId: number
  initial: ParticipatesResponse
  type: LabelValue
}

const ScenarioParticipatesTable = ({ scenarioId, initial, type }: Props) => {
  const isTrpg = useMemo(() => type.value === ScenarioType.Trpg.value, [type])
  const [participates, setParticipates] = useState<ParticipatesResponse>(initial)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
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
    // ページ連打時に古いレスポンスが後着して上書きしないよう破棄する
    let ignore = false
    const fetch = async () => {
      try {
        const res = await fetchScenarioParticipates({
          scenario_id: scenarioId,
          is_twitter_following: false,
          page_num: pagination.pageIndex + 1,
          page_size: pagination.pageSize
        })
        if (ignore) return
        setParticipates(res)
        setErrorMessage(null)
      } catch (e) {
        if (ignore) return
        setErrorMessage('通過記録の取得に失敗しました')
      }
    }
    fetch()
    return () => {
      ignore = true
    }
  }, [scenarioId, pagination])

  const displayParticipates = useMemo(() => {
    return convertToDisplayParticipates(participates.list)
  }, [participates])

  const columns: ColumnDef<DisplayParticipate, any>[] = useMemo(() => {
    let columns: ColumnDef<DisplayParticipate, any>[] = []
    if (isTrpg) {
      columns = columns.concat([RuleBooksColumnDef])
    }
    return columns.concat([
      UserColumnDef,
      RoleColumnDef,
      TermNameColumnDef,
      RequiredHoursColumnDef,
      PlayerNumNameColumnDef,
      GameMasterNameColumnDef,
      PlayerNamesColumnDef,
      MemoColumnDef,
      ImpressionColumnDef
    ])
  }, [type])

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
      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
      {participates.all_record_count > 0 && (
        <div className='border-x border-b border-slate-300 px-2 py-2 bg-gray-100 text-xs'>
          <p className='mb-1'>全{participates.all_record_count}件</p>
          <PaginationFooter table={table} />
        </div>
      )}
    </div>
  )
}

export default ScenarioParticipatesTable
