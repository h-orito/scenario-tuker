import { ScenarioType } from '@/@types/scenario-type'
import { putParticipates } from '@/components/api/myself-api'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/scondary-button'
import InputSelect from '@/components/form/input-select'
import Modal from '@/components/modal/modal'
import {
  convertToDisplayParticipates,
  DisplayParticipate,
  ParticipatesTableColumn,
  RoleColumnDef,
  ScenarioNameColumnDef,
  TermNameColumnDef
} from '@/components/pages/participates/participates-table'
import PaginationFooter from '@/components/table/pagination-footer'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Cell,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'

type Props = {
  participates: ParticipateResponse[]
  type: ScenarioType
  toggleModal: (e: any) => void
  postSave: () => void
}

const SortParticipatesModal = ({
  participates: initialParticipates,
  type,
  toggleModal,
  postSave
}: Props) => {
  const [loading, setLoading] = useState(false)
  const [participates, setParticipates] =
    useState<ParticipateResponse[]>(initialParticipates)
  const [orgParticipates] = useState<ParticipateResponse[]>(initialParticipates)

  const save = async () => {
    setLoading(true)
    for (let i = 0; i < participates.length; i++) {
      const p = participates[i]
      const newDispOrder = i + 1
      const orgP = orgParticipates.find((op) => op.id === p.id)
      // 並び順が変更された通過記録のみ更新
      if (orgP?.disp_order === newDispOrder) continue
      await putParticipates({
        id: p.id,
        scenario_id: p.scenario?.id ?? 0,
        rule_book_ids: p.rule_books.map((r) => r.id),
        role_names: p.role_names,
        impression: p.impression,
        term_from: p.term?.from ?? null,
        term_to: p.term?.to ?? null,
        player_num: p.player_num,
        required_hours: p.required_hours,
        game_master: p.game_master,
        player_names: p.player_names,
        memo: p.memo,
        disp_order: i + 1
      })
    }
    setLoading(false)
    postSave()
  }

  const displayParticipates = useMemo(() => {
    return convertToDisplayParticipates(participates)
  }, [convertToDisplayParticipates, participates])

  const up = (e: any, idx: number) => {
    e.preventDefault()
    if (idx === 0) return
    const newParticipates = replaceArrayElements(participates, idx, idx - 1)
    setParticipates(newParticipates)
  }

  const down = (e: any, idx: number) => {
    e.preventDefault()
    if (idx === participates.length - 1) return
    const newParticipates = replaceArrayElements(participates, idx + 1, idx)
    setParticipates(newParticipates)
  }

  const replaceArrayElements = (
    array: Array<ParticipateResponse>,
    targetIndex: number,
    sourceIndex: number
  ) => {
    const cloneArray = [...array]
    return cloneArray.map((elm, idx) => {
      if (idx === targetIndex) return array[sourceIndex]
      if (idx === sourceIndex) return array[targetIndex]
      return elm
    })
  }

  const sort = (sortKey: string) => {
    if (!sortKey) return
    const newParticipates = [...participates]
    const sortFn = getSortFn(sortKey)
    setParticipates(newParticipates.sort((a, b) => sortFn(a, b)))
  }

  const columns: ColumnDef<DisplayParticipate, any>[] = [
    ScenarioNameColumnDef,
    RoleColumnDef,
    TermNameColumnDef,
    {
      accessorKey: 'sort',
      header: '並び替え',
      cell: ({ cell }) => (
        <SortColumn
          cell={cell}
          up={up}
          down={down}
          wholeCount={participates.length}
        />
      )
    }
  ]

  const table = useReactTable<DisplayParticipate>({
    data: displayParticipates,
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

  const options = useMemo(() => {
    if (type.value !== ScenarioType.Trpg.value) {
      return baseSortKeys.filter((lb) => !lb.value.startsWith('game_system'))
    } else {
      return baseSortKeys
    }
  }, [type])
  const [sortKey, setSortKey] = useState<string>('')

  return (
    <Modal close={toggleModal} hideFooter>
      <>
        <h2>通過記録の並び替え</h2>
        <div className='flex justify-end mb-2'>
          <InputSelect
            className='text-xs'
            candidates={options}
            selected={sortKey}
            setSelected={setSortKey}
            onChange={sort}
          />
        </div>
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
            {displayParticipates.length > 0 && (
              <tfoot>
                <tr>
                  <th
                    colSpan={columns.length}
                    className='bg-gray-100 px-2 py-2'
                  >
                    <PaginationFooter table={table} />
                  </th>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        <div className='mt-8 flex justify-end gap-2'>
          <SecondaryButton click={toggleModal}>キャンセル</SecondaryButton>
          <PrimaryButton click={save} disabled={loading}>
            {loading ? '更新中...' : '更新する'}
          </PrimaryButton>
        </div>
      </>
    </Modal>
  )
}

export default SortParticipatesModal

type SortColumnProps = {
  cell: Cell<DisplayParticipate, unknown>
  up: (e: any, idx: number) => void
  down: (e: any, idx: number) => void
  wholeCount: number
}

const SortColumn = ({ cell, up, down, wholeCount }: SortColumnProps) => {
  return (
    <ParticipatesTableColumn cell={cell} className='w-8'>
      <div className='flex gap-2'>
        <PrimaryButton
          className='py-0'
          click={(e) => up(e, cell.row.index)}
          disabled={cell.row.index === 0}
        >
          <FontAwesomeIcon icon={faArrowUp} className='h-3' />
        </PrimaryButton>
        <PrimaryButton
          className='py-0'
          click={(e) => down(e, cell.row.index)}
          disabled={cell.row.index === wholeCount - 1}
        >
          <FontAwesomeIcon icon={faArrowDown} className='h-3' />
        </PrimaryButton>
      </div>
    </ParticipatesTableColumn>
  )
}

const baseSortKeys = [
  {
    label: '一括並び替え',
    value: ''
  },
  {
    label: '登録日昇順',
    value: 'id_asc'
  },
  {
    label: '登録日降順',
    value: 'id_desc'
  },
  {
    label: 'シナリオ名昇順',
    value: 'scenario_asc'
  },
  {
    label: 'シナリオ名降順',
    value: 'scenario_desc'
  },
  {
    label: 'ゲームシステム名昇順',
    value: 'game_system_asc'
  },
  {
    label: 'ゲームシステム名降順',
    value: 'game_system_desc'
  },
  {
    label: '役割昇順',
    value: 'role_asc'
  },
  {
    label: '役割降順',
    value: 'role_desc'
  },
  {
    label: '日程昇順',
    value: 'term_asc'
  },
  {
    label: '日程降順',
    value: 'term_desc'
  }
]

const getSortFn = (
  sortKey: string
): ((a: ParticipateResponse, b: ParticipateResponse) => number) => {
  const isAsc = sortKey.endsWith('_asc')
  const key = sortKey.replace(/_asc|_desc/, '')
  switch (key) {
    case 'id':
      return (a, b) => (isAsc ? a.id - b.id : b.id - a.id)
    case 'scenario':
      return (a, b) => {
        const aName = a.scenario?.name ?? ''
        const bName = b.scenario?.name ?? ''
        return isAsc ? aName.localeCompare(bName) : bName.localeCompare(aName)
      }
    case 'game_system':
      return (a, b) => {
        const aName = a.scenario?.game_system?.name ?? ''
        const bName = b.scenario?.game_system?.name ?? ''
        return isAsc ? aName.localeCompare(bName) : bName.localeCompare(aName)
      }
    case 'role':
      return (a, b) => {
        const aRoles = a.role_names.join()
        const bRoles = b.role_names.join()
        return isAsc
          ? aRoles.localeCompare(bRoles)
          : bRoles.localeCompare(aRoles)
      }
    case 'term':
      return (a, b) => {
        const aTerm = a.term?.from ?? a.term?.to ?? '9999-99-99'
        const bTerm = b.term?.from ?? b.term?.to ?? '9999-99-99'
        return isAsc ? aTerm.localeCompare(bTerm) : bTerm.localeCompare(aTerm)
      }
    default:
      return (a, b) => a.id - b.id
  }
}
