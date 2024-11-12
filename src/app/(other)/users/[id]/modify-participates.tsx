import { DisclosureRange } from '@/@types/disclosure-range'
import { ScenarioType } from '@/@types/scenario-type'
import { putParticipates } from '@/components/api/myself-api'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/scondary-button'
import Modal from '@/components/modal/modal'
import NormalNotification from '@/components/notification/normal-notification'
import RoleNamesSelect from '@/components/pages/participates/form/role-names-select'
import {
  convertToDisplayParticipates,
  DisplayParticipate,
  sortableHeader
} from '@/components/pages/participates/participates-table'
import { Filter } from '@/components/table/header'
import PaginationFooter from '@/components/table/pagination-footer'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Cell,
  CellContext,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowData,
  useReactTable
} from '@tanstack/react-table'
import { type } from 'os'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  participates: ParticipateResponse[]
  scenarioType: ScenarioType
  toggleModal: (e: any) => void
  postSave: () => void
}

const ModifyParticipatesModal = ({
  participates: initialParticipates,
  scenarioType,
  toggleModal,
  postSave
}: Props) => {
  const [participates, setParticipates] = useState<ParticipateResponse[]>([
    ...initialParticipates
  ])
  const [targetIds, setTargetIds] = useState<number[]>([])
  const [submitting, setSubmitting] = useState<boolean>(false)
  const canSubmit: boolean = useMemo(() => {
    return !submitting && participates.every((p) => p.role_names.length > 0)
  }, [submitting, participates])

  const save = useCallback(async () => {
    setSubmitting(true)
    for (let i = 0; i < targetIds.length; i++) {
      const targetId = targetIds[i]
      const p = participates.find((p) => p.id === targetId)
      if (!p) continue
      await putParticipates({
        id: p.id,
        scenario_id: p.scenario.id,
        rule_book_ids: p.rule_books.map((rb) => rb.id),
        role_names: p.role_names,
        impression: {
          has_spoiler: p.impression?.has_spoiler ?? false,
          disclosure_range:
            p.impression?.disclosure_range ?? DisclosureRange.Everyone.value,
          content: p.impression?.content ?? ''
        },
        term_from: p.term?.from ?? null,
        term_to: p.term?.to ?? null,
        player_num: p.player_num ?? null,
        required_hours: p.required_hours ?? null,
        game_master: p.game_master ?? '',
        player_names: p.player_names ?? '',
        memo: p.memo ?? null,
        disp_order: p.disp_order
      })
    }
    setSubmitting(false)
    postSave()
  }, [participates, targetIds])

  const displayParticipates = useMemo(() => {
    return convertToDisplayParticipates(participates)
  }, [convertToDisplayParticipates, participates])

  const handleModifyParticipates = (p: ParticipateResponse) => {
    const newParticipates = participates.map((participate) => {
      if (participate.id === p.id) {
        return p
      }
      return participate
    })
    setParticipates(newParticipates)
    if (!targetIds.includes(p.id)) {
      setTargetIds([...targetIds, p.id])
    }
  }

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

  const columns: ColumnDef<DisplayParticipate, any>[] = useMemo(() => {
    let columns = [scenarioNameColumnDef]
    if (scenarioType === ScenarioType.Trpg) {
      columns = columns.concat([gameSystemColumnDef, ruleBooksColumnDef])
    }
    columns = columns.concat([
      roleNameColumnDef(handleModifyParticipates, skipAutoResetPageIndex),
      termFromColumnDef(handleModifyParticipates, skipAutoResetPageIndex),
      termToColumnDef(handleModifyParticipates, skipAutoResetPageIndex),
      personNumColumnDef(handleModifyParticipates, skipAutoResetPageIndex),
      gameMasterColumnDef,
      playerNamesColumnDef,
      memoColumnDef
    ])
    return columns
  }, [type, termFromColumnDef, handleModifyParticipates])

  const table = useReactTable<DisplayParticipate>({
    data: displayParticipates,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
    getSortedRowModel: getSortedRowModel(),
    autoResetPageIndex,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10
      }
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        skipAutoResetPageIndex()
        setParticipates((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value
              }
            }
            return row
          })
        )
        const p = participates[rowIndex]
        if (!targetIds.includes(p.id)) {
          setTargetIds([...targetIds, p.id])
        }
      }
    }
  })

  const confirmToClose = (e: any) => {
    if (targetIds.length > 0) {
      if (window.confirm('変更を破棄しますか？')) {
        toggleModal(e)
      }
    } else {
      toggleModal(e)
    }
  }

  return (
    <Modal close={toggleModal} hideFooter hideOnClickOutside={false}>
      <>
        <h2>通過記録一括編集</h2>
        <NormalNotification className='text-xs my-2'>
          <p>
            一部項目を除く全ての内容を一括で編集できます。
            <br />
            「更新する」を押下すると反映されます。
          </p>
        </NormalNotification>
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
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td key={cell.id} className='td text-left'>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        {displayParticipates.length > 0 && (
          <div className='border border-slate-300 px-2 py-2 bg-gray-100 text-xs'>
            <PaginationFooter table={table} />
          </div>
        )}
        <div className='mt-8 flex justify-end gap-2'>
          <SecondaryButton click={confirmToClose}>キャンセル</SecondaryButton>
          <PrimaryButton disabled={!canSubmit} click={save}>
            更新する
          </PrimaryButton>
        </div>
      </>
    </Modal>
  )
}

export default ModifyParticipatesModal

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

function useSkipper() {
  const shouldSkipRef = useRef(true)
  const shouldSkip = shouldSkipRef.current

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = useCallback(() => {
    shouldSkipRef.current = false
  }, [])

  useEffect(() => {
    shouldSkipRef.current = true
  })

  return [shouldSkip, skip] as const
}

const inputTextColumn = ({
  getValue,
  row: { index },
  column: { id },
  table
}: CellContext<ParticipateResponse, unknown>) => {
  const initialValue = getValue()
  const [value, setValue] = useState(initialValue)

  const onBlur = () => {
    table.options.meta?.updateData(index, id, value)
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <input
      className='rounded border border-gray-300 px-2 py-1 text-gray-700'
      value={value as string}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
    />
  )
}

const scenarioNameColumnDef: ColumnDef<DisplayParticipate, any> = {
  accessorKey: 'scenario.name',
  header: sortableHeader('シナリオ名'),
  sortingFn: (a, b) => {
    return a.original.scenario.name.localeCompare(b.original.scenario.name)
  },
  filterFn: (row, _, filterValue) => {
    return row.original.scenario.name.includes(filterValue)
  }
}

const gameSystemColumnDef: ColumnDef<DisplayParticipate, any> = {
  id: 'game_system',
  accessorFn: (row) => row.scenario.game_system?.name ?? '',
  header: sortableHeader('ゲームシステム'),
  sortingFn: (a, b) => {
    const aN = a.original.scenario.game_system?.name ?? ''
    const bN = b.original.scenario.game_system?.name ?? ''
    return aN.localeCompare(bN)
  },
  filterFn: (row, _, filterValue) => {
    return (
      row.original.scenario.game_system?.name.includes(filterValue) ?? false
    )
  }
}

const ruleBooksColumnDef: ColumnDef<DisplayParticipate, any> = {
  id: 'rule_books',
  accessorFn: (row) => row.rule_books.map((rb) => rb.name).join('、'),
  header: sortableHeader('ルールブック'),
  sortingFn: (a, b) => {
    const aN = a.original.rule_books.map((rb) => rb.name).join('、')
    const bN = b.original.rule_books.map((rb) => rb.name).join('、')
    return aN.localeCompare(bN)
  },
  filterFn: (row, _, filterValue) => {
    return (
      row.original.rule_books
        .map((rb) => rb.name)
        .join('、')
        .includes(filterValue) ?? false
    )
  }
}

const roleNameColumnDef = (
  setParticipate: (p: ParticipateResponse) => void,
  skipAutoResetPageIndex: () => void
): ColumnDef<DisplayParticipate, any> => {
  return {
    accessorKey: 'person_num',
    accessorFn: (row) => row.role_names.join('、'),
    header: sortableHeader('役割'),
    cell: ({ cell }) => (
      <RoleNamesColumn
        cell={cell}
        setParticipate={setParticipate}
        skipAutoResetPageIndex={skipAutoResetPageIndex}
      />
    ),
    sortingFn: (a, b) => {
      const aRoleNames = a.original.role_names.join('、')
      const bRoleNames = b.original.role_names.join('、')
      return aRoleNames.localeCompare(bRoleNames)
    },
    filterFn: (row, _, filterValue) => {
      const roleNames = row.original.role_names.join('、')
      return roleNames.includes(filterValue)
    }
  }
}

const RoleNamesColumn = ({
  cell,
  setParticipate,
  skipAutoResetPageIndex
}: {
  cell: Cell<DisplayParticipate, any>
  setParticipate: (p: ParticipateResponse) => void
  skipAutoResetPageIndex: () => void
}) => {
  const participate = cell.row.original
  const handleSet = (value: string[]) => {
    skipAutoResetPageIndex()
    const newParticipate = {
      ...participate,
      role_names: value
    }
    setParticipate(newParticipate)
  }
  return (
    <div
      className={`min-w-96 ${participate.role_names.length === 0 ? 'border rounded border-red-500' : ''}`}
    >
      <RoleNamesSelect
        selected={participate.role_names}
        setSelected={handleSet}
      />
    </div>
  )
}

const termFromColumnDef = (
  setParticipate: (p: ParticipateResponse) => void,
  skipAutoResetPageIndex: () => void
): ColumnDef<DisplayParticipate, any> => {
  return {
    accessorKey: 'term.from',
    accessorFn: (row) => row.term?.from ?? '',
    header: sortableHeader('日程（開始）'),
    cell: ({ cell }) => (
      <TermFromColumn
        cell={cell}
        setParticipate={setParticipate}
        skipAutoResetPageIndex={skipAutoResetPageIndex}
      />
    ),
    sortingFn: (a, b) => {
      const aTerm = a.original.term?.from ?? ''
      const bTerm = b.original.term?.from ?? ''
      return aTerm.localeCompare(bTerm)
    },
    filterFn: (row, _, filterValue) => {
      const term = row.original.term?.from ?? ''
      return term.includes(filterValue)
    }
  }
}

const TermFromColumn = ({
  cell,
  setParticipate,
  skipAutoResetPageIndex
}: {
  cell: Cell<DisplayParticipate, any>
  setParticipate: (p: ParticipateResponse) => void
  skipAutoResetPageIndex: () => void
}) => {
  const participate = cell.row.original
  const term = participate.term?.from ?? ''
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    skipAutoResetPageIndex()
    const newParticipate = {
      ...participate,
      term: {
        from: e.target.value,
        to: participate.term?.to ?? ''
      }
    }
    setParticipate(newParticipate)
  }
  return (
    <input
      className={`rounded border border-gray-300 px-2 py-1 text-gray-700`}
      type='date'
      name={`from_${cell.id}`}
      value={term}
      onChange={handleChange}
      max={participate.term?.to ?? ''}
    />
  )
}

const termToColumnDef = (
  setParticipate: (p: ParticipateResponse) => void,
  skipAutoResetPageIndex: () => void
): ColumnDef<DisplayParticipate, any> => {
  return {
    accessorKey: 'term.to',
    header: sortableHeader('日程（終了）'),
    cell: ({ cell }) => (
      <TermToColumn
        cell={cell}
        setParticipate={setParticipate}
        skipAutoResetPageIndex={skipAutoResetPageIndex}
      />
    ),
    sortingFn: (a, b) => {
      const aTerm = a.original.term?.to ?? ''
      const bTerm = b.original.term?.to ?? ''
      return aTerm.localeCompare(bTerm)
    },
    filterFn: (row, _, filterValue) => {
      const term = row.original.term?.to ?? ''
      return term.includes(filterValue)
    }
  }
}

const TermToColumn = ({
  cell,
  setParticipate,
  skipAutoResetPageIndex
}: {
  cell: Cell<DisplayParticipate, any>
  setParticipate: (p: ParticipateResponse) => void
  skipAutoResetPageIndex: () => void
}) => {
  const participate = cell.row.original
  const term = participate.term?.to ?? ''
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    skipAutoResetPageIndex()
    const newParticipate = {
      ...participate,
      term: {
        from: participate.term?.from ?? '',
        to: e.target.value
      }
    }
    setParticipate(newParticipate)
  }
  return (
    <input
      className={`rounded border border-gray-300 px-2 py-1 text-gray-700`}
      type='date'
      name={`to_${cell.id}`}
      value={term}
      onChange={handleChange}
      min={participate.term?.from ?? ''}
    />
  )
}

const personNumColumnDef = (
  setParticipate: (p: ParticipateResponse) => void,
  skipAutoResetPageIndex: () => void
): ColumnDef<DisplayParticipate, any> => {
  return {
    accessorKey: 'role_names',
    header: sortableHeader('PL人数'),
    cell: ({ cell }) => (
      <PersonNumColumn
        cell={cell}
        setParticipate={setParticipate}
        skipAutoResetPageIndex={skipAutoResetPageIndex}
      />
    ),
    sortingFn: (a, b) => {
      const aN = a.original.player_num ?? 0
      const bN = b.original.player_num ?? 0
      return aN - bN
    },
    filterFn: (row, _, filterValue) => {
      const n = row.original.player_num ?? 0
      return n <= parseInt(filterValue)
    }
  }
}

const PersonNumColumn = ({
  cell,
  setParticipate,
  skipAutoResetPageIndex
}: {
  cell: Cell<DisplayParticipate, any>
  setParticipate: (p: ParticipateResponse) => void
  skipAutoResetPageIndex: () => void
}) => {
  const participate = cell.row.original
  const setValue = (value: string) => {
    skipAutoResetPageIndex()
    const newParticipate = {
      ...participate,
      player_num: Number(value)
    }
    setParticipate(newParticipate)
  }

  const decrement = (e: any) => {
    e.preventDefault()
    const value = participate.player_num || 0
    const step = 1
    const newValue = value - step
    if (newValue < 1) return
    setValue(String(newValue))
  }

  const increment = (e: any) => {
    e.preventDefault()
    const value = participate.player_num || 0
    const step = 1
    const newValue = value + step
    setValue(String(newValue))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <div className='flex'>
      <button
        className='rounded-l-lg border bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-600 disabled:bg-blue-200'
        onClick={decrement}
      >
        <FontAwesomeIcon icon={faMinus} />
      </button>
      <input
        type='number'
        className={`flex-1 border border-gray-300 max-w-20 px-2 py-1 text-right`}
        name={`player_num_${cell.id}`}
        onChange={handleChange}
        value={participate.player_num || ''}
        min={1}
      />
      <button
        className='rounded-r-lg border bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-600 disabled:bg-blue-200'
        onClick={increment}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  )
}

const gameMasterColumnDef: ColumnDef<DisplayParticipate, any> = {
  accessorKey: 'game_master',
  header: sortableHeader('GM'),
  cell: inputTextColumn,
  sortingFn: (a, b) => {
    const aGM = a.original.game_master || ''
    const bGM = b.original.game_master || ''
    return aGM.localeCompare(bGM)
  },
  filterFn: (row, _, filterValue) => {
    return row.original.game_master?.includes(filterValue) ?? false
  }
}

const playerNamesColumnDef: ColumnDef<DisplayParticipate, any> = {
  accessorKey: 'player_names',
  header: sortableHeader('参加PL'),
  cell: inputTextColumn,
  sortingFn: (a, b) => {
    const aPN = a.original.player_names || ''
    const bPN = b.original.player_names || ''
    return aPN.localeCompare(bPN)
  },
  filterFn: (row, _, filterValue) => {
    return row.original.player_names?.includes(filterValue) ?? false
  }
}

const memoColumnDef: ColumnDef<DisplayParticipate, any> = {
  accessorKey: 'memo',
  header: sortableHeader('メモ'),
  cell: inputTextColumn,
  sortingFn: (a, b) => {
    const aM = a.original.memo || ''
    const bM = b.original.memo || ''
    return aM.localeCompare(bM)
  },
  filterFn: (row, _, filterValue) => {
    return row.original.memo?.includes(filterValue) ?? false
  }
}
