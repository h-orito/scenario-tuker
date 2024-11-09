'use client'

import ModifyScenarioModal from '@/app/(other)/scenarios/modify-scenario'
import { useAuth } from '@/components/auth/use-auth'
import useModalState from '@/components/modal/modal-state'
import {
  AuthorsColumnDef,
  convertToDisplayScenarios,
  DisplayScenario,
  GameMasterColumnDef,
  GameSystemColumnDef,
  ParticipateCountColumnDef,
  PlayerNumColumnDef,
  RequiredHoursColumnDef,
  ScenarioNameColumnDef,
  ScenariosTableColumn,
  TypeColumnDef
} from '@/components/pages/scenarios/scenarios-table'
import { Filter } from '@/components/table/header'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
import DangerButton from '../../../components/button/danger-button'
import PrimaryButton from '../../../components/button/primary-button'
import PaginationFooter from '../../../components/table/pagination-footer'
import DeleteScenarioModal from './delete-scenario'

type ScenariosTableProps = {
  scenarios: ScenarioResponse[]
  reload?: () => void
}

const ScenariosTable = (props: ScenariosTableProps) => {
  const { scenarios, reload } = props

  const displayScenarios = useMemo(() => {
    return convertToDisplayScenarios(scenarios)
  }, [convertToDisplayScenarios, scenarios])

  const columns: ColumnDef<DisplayScenario, any>[] = useMemo(
    () => [
      ScenarioNameColumnDef,
      TypeColumnDef,
      GameSystemColumnDef,
      AuthorsColumnDef,
      GameMasterColumnDef,
      PlayerNumColumnDef,
      RequiredHoursColumnDef,
      ParticipateCountColumnDef,
      {
        accessorKey: 'editors',
        header: '編集',
        cell: ({ cell }) => <EditColumn cell={cell} reload={reload} />,
        enableColumnFilter: false
      }
    ],
    []
  )

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
        {displayScenarios.length > 0 && (
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

type EditColumnProps = {
  cell: Cell<DisplayScenario, unknown>
  reload: (() => void) | undefined
}

const EditColumn = ({ cell, reload }: EditColumnProps) => {
  const scenario = cell.row.original
  const [
    isShowModifyModal,
    openModifyModal,
    closeModifyModal,
    toggleModifyModal
  ] = useModalState()
  const handlePostSave = async (scenario: ScenarioResponse) => {
    reload && (await reload())
    closeModifyModal()
  }

  const [
    isShowDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    toggleDeleteModal
  ] = useModalState()
  const handlePostDelete = async () => {
    reload && (await reload())
    closeDeleteModal()
  }

  const canModify = useAuth().isSignedIn

  return (
    <ScenariosTableColumn cell={cell} className='w-8'>
      <PrimaryButton
        className='py-1'
        click={openModifyModal}
        disabled={!canModify}
      >
        <FontAwesomeIcon icon={faPencil} />
      </PrimaryButton>
      {isShowModifyModal && (
        <ModifyScenarioModal
          scenario={scenario}
          toggleModal={toggleModifyModal}
          postSave={handlePostSave}
        />
      )}
      <DangerButton
        className='ml-1 py-1'
        click={openDeleteModal}
        disabled={!canModify}
      >
        <FontAwesomeIcon icon={faTrash} />
      </DangerButton>
      {isShowDeleteModal && (
        <DeleteScenarioModal
          scenario={scenario}
          toggleModal={toggleDeleteModal}
          postDelete={handlePostDelete}
        />
      )}
    </ScenariosTableColumn>
  )
}

export default ScenariosTable
