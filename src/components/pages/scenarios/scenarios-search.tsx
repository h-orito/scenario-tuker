'use client'

import { ScenarioType } from '@/@types/scenario-type'
import { searchScenarios } from '@/components/api/scenario-api'
import DangerButton from '@/components/button/danger-button'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/scondary-button'
import Modal from '@/components/modal/modal'
import NormalNotification from '@/components/notification/normal-notification'
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
import { useEffect, useMemo, useState } from 'react'
import {
  AuthorsColumnDef,
  convertToDisplayScenarios,
  DisplayScenario,
  GameSystemColumnDef,
  ScenarioNameColumnDef,
  ScenariosTableColumn
} from './scenarios-table'

type Props = {
  scenarioType: ScenarioType
  toggleModal: (e: any) => void
  closeModal: () => void
  setSelected: (value: ScenarioResponse[]) => void
}

const ScenariosSearch = ({
  scenarioType,
  toggleModal,
  closeModal,
  setSelected
}: Props) => {
  const [scenarios, setScenarios] = useState<ScenarioResponse[]>([])
  const [selectingScenarios, setSelectingScenarios] = useState<
    ScenarioResponse[]
  >([])

  useEffect(() => {
    const fetch = async () => {
      const res = await searchScenarios({
        type: scenarioType.value,
        name: null,
        game_system_id: null,
        game_system_name: null,
        author_name: null,
        player_num: null,
        player_num_empty: true
      })
      setScenarios(res.list)
    }
    fetch()
  }, [])

  const displayScenarios = useMemo(() => {
    return convertToDisplayScenarios(scenarios)
  }, [convertToDisplayScenarios, scenarios])

  const handleAdd = (scenario: ScenarioResponse) => {
    const newSelectings = selectingScenarios.concat(scenario)
    setSelectingScenarios(newSelectings)
  }

  const handleRemove = (scenario: ScenarioResponse) => {
    const newSelectings = selectingScenarios.filter((s) => s.id !== scenario.id)
    setSelectingScenarios(newSelectings)
  }

  const decide = () => {
    setSelected(selectingScenarios)
    closeModal()
  }

  const columns: ColumnDef<DisplayScenario, any>[] = useMemo(() => {
    const list: ColumnDef<DisplayScenario, any>[] = [
      {
        accessorKey: 'select',
        header: '選択',
        cell: ({ cell }) => (
          <AddColumn
            cell={cell}
            remove={handleRemove}
            add={handleAdd}
            selecting={selectingScenarios}
          />
        ),
        enableColumnFilter: false
      },
      ScenarioNameColumnDef
    ]
    if (scenarioType === ScenarioType.Trpg) {
      list.push(GameSystemColumnDef)
    }
    list.push(AuthorsColumnDef)
    return list
  }, [scenarioType, selectingScenarios])

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
    <Modal close={toggleModal} hideFooter>
      <>
        <p>シナリオを選択してください。</p>
        <div className='my-6'>
          <p>選択中のシナリオ</p>
          <NormalNotification className='text-xs'>
            <ul className='list-disc text-left'>
              {selectingScenarios.map((s) => (
                <li key={s.id}>{s.name}</li>
              ))}
            </ul>
          </NormalNotification>
        </div>
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
        <div className='mt-8 flex justify-end gap-2'>
          <SecondaryButton click={toggleModal}>キャンセル</SecondaryButton>
          <PrimaryButton click={decide}>選択する</PrimaryButton>
        </div>
      </>
    </Modal>
  )
}

export default ScenariosSearch

const AddColumn = ({
  cell,
  add,
  remove,
  selecting
}: {
  cell: Cell<DisplayScenario, any>
  add: (scenario: ScenarioResponse) => void
  remove: (scenario: ScenarioResponse) => void
  selecting: ScenarioResponse[]
}) => {
  const exists = useMemo(
    () => selecting.some((s) => s.id === cell.row.original.id),
    [selecting, cell.row.original.id]
  )
  return (
    <ScenariosTableColumn cell={cell} className='w-8'>
      {exists ? (
        <DangerButton className='py-1' click={() => remove(cell.row.original)}>
          削除
        </DangerButton>
      ) : (
        <PrimaryButton className='py-1' click={() => add(cell.row.original)}>
          追加
        </PrimaryButton>
      )}
    </ScenariosTableColumn>
  )
}
