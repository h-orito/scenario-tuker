'use client'

import ModifyScenarioModal from '@/app/(other)/scenarios/modify-scenario'
import { useAuth } from '@/components/auth/use-auth'
import {
  AuthorsColumn,
  baseScenarioTableColumns,
  convertToDisplayScenarios,
  DisplayScenario,
  GameSystemColumn,
  ScenarioNameColumn,
  ScenariosTableColumn,
  ScenariosTableSimpleColumn
} from '@/components/pages/scenarios/scenarios-table'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
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
import DangerButton from '../../../components/button/danger-button'
import PrimaryButton from '../../../components/button/primary-button'
import PaginationFooter from '../../../components/table/pagination-footer'

type ScenariosTableProps = {
  scenarios: ScenarioResponse[]
  reload?: () => void
}

const ScenariosTable = (props: ScenariosTableProps) => {
  const { scenarios, reload } = props

  const displayScenarios = useMemo(() => {
    return convertToDisplayScenarios(scenarios)
  }, [convertToDisplayScenarios, scenarios])

  const columns: ColumnDef<DisplayScenario, any>[] = useMemo(() => {
    const list = baseScenarioTableColumns.concat({
      accessorKey: 'editors',
      header: '編集'
    })
    return list
  }, [])

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
                  <EditColumn cell={cells[8]} reload={reload} />
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

type EditColumnProps = {
  cell: Cell<DisplayScenario, unknown>
  reload: (() => void) | undefined
}

const EditColumn = ({ cell, reload }: EditColumnProps) => {
  const scenario = cell.row.original
  const [modifyScenario, setModifyScenario] = useState<ScenarioResponse | null>(
    null
  )
  const [isOpenModifyModal, setIsOpenModifyModal] = useState(false)
  const openModifyModal = (scenario: ScenarioResponse) => {
    setModifyScenario(scenario)
    setIsOpenModifyModal(true)
  }
  const toggleModifyModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenModifyModal(!isOpenModifyModal)
    }
  }

  const handlePostSave = async (scenario: ScenarioResponse) => {
    reload && (await reload())
    setIsOpenModifyModal(false)
  }

  const canModify = useAuth().isSignedIn

  return (
    <ScenariosTableColumn cell={cell} className='w-8'>
      <PrimaryButton
        click={() => openModifyModal(scenario)}
        disabled={!canModify}
      >
        <FontAwesomeIcon icon={faPencil} />
      </PrimaryButton>
      {isOpenModifyModal && (
        <ModifyScenarioModal
          scenario={modifyScenario!}
          toggleModal={toggleModifyModal}
          postSave={handlePostSave}
        />
      )}
      <DangerButton className='ml-1' click={() => {}} disabled={!canModify}>
        <FontAwesomeIcon icon={faTrash} />
      </DangerButton>
    </ScenariosTableColumn>
  )
}

export default ScenariosTable
