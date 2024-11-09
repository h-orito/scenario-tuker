'use client'

import { ScenarioType } from '@/@types/scenario-type'
import { searchScenarios } from '@/components/api/scenario-api'
import PrimaryButton from '@/components/button/primary-button'
import Modal from '@/components/modal/modal'
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
  setSelected: (value: ScenarioResponse | null) => void
}

const ScenarioSearch = ({
  scenarioType,
  toggleModal,
  closeModal,
  setSelected
}: Props) => {
  const [scenarios, setScenarios] = useState<ScenarioResponse[]>([])

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
    setSelected(scenario)
    closeModal()
  }

  const columns: ColumnDef<DisplayScenario, any>[] = useMemo(() => {
    const list: ColumnDef<DisplayScenario, any>[] = [
      {
        accessorKey: 'select',
        header: '選択',
        cell: ({ cell }) => <AddColumn cell={cell} add={handleAdd} />,
        enableColumnFilter: false
      },
      ScenarioNameColumnDef
    ]
    if (scenarioType === ScenarioType.Trpg) {
      list.push(GameSystemColumnDef)
    }
    list.push(AuthorsColumnDef)
    return list
  }, [scenarioType])

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
    <Modal close={toggleModal}>
      <>
        <p>シナリオを選択してください。</p>
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
            {displayScenarios.length > 0 && (
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
      </>
    </Modal>
  )
}

export default ScenarioSearch

const AddColumn = ({
  cell,
  add
}: {
  cell: Cell<DisplayScenario, any>
  add: (scenario: ScenarioResponse) => void
}) => {
  return (
    <ScenariosTableColumn cell={cell} className='w-8'>
      <PrimaryButton className='py-1' click={() => add(cell.row.original)}>
        選択
      </PrimaryButton>
    </ScenariosTableColumn>
  )
}
