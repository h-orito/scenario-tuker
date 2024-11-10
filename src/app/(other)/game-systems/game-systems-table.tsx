'use client'

import { useAuth } from '@/components/auth/use-auth'
import PrimaryButton from '@/components/button/primary-button'
import { Filter } from '@/components/table/header'
import PaginationFooter from '@/components/table/pagination-footer'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
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
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import ModifyGameSystemModal from './modify-game-system'

type Props = {
  gameSystems: GameSystem[]
  reload: () => void
}

const GameSystemsTable = ({ gameSystems, reload }: Props) => {
  const columns: ColumnDef<GameSystem, any>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'ゲームシステム名',
        cell: ({ cell }) => <GameSystemColumn cell={cell} />
      },
      {
        accessorKey: 'editors',
        header: '編集',
        cell: ({ cell }) => <EditColumn cell={cell} reload={reload} />,
        enableColumnFilter: false
      }
    ],
    [reload]
  )
  const table = useReactTable<GameSystem>({
    data: gameSystems,
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
      <table className='w-full table-auto border-collapse border border-slate-300 text-xs'>
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
              <td colSpan={2} className='td text-left'>
                該当するデータがありません
              </td>
            </tr>
          ) : (
            table
              .getRowModel()
              .rows.map((row) => (
                <tr key={row.id}>
                  {row
                    .getVisibleCells()
                    .map((cell) =>
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                </tr>
              ))
          )}
        </tbody>
      </table>
      {gameSystems.length > 0 && (
        <div className='border-x border-b border-slate-300 px-2 py-2 bg-gray-100 text-xs'>
          <PaginationFooter table={table} />
        </div>
      )}
    </div>
  )
}

export default GameSystemsTable

const GameSystemColumn = ({ cell }: { cell: Cell<GameSystem, unknown> }) => {
  const gameSystem = cell.row.original
  return (
    <td key={cell.id} className='td text-left'>
      <Link href={`/game-systems/${gameSystem.id}`}>{gameSystem.name}</Link>
    </td>
  )
}

const EditColumn = ({
  cell,
  reload
}: {
  cell: Cell<GameSystem, unknown>
  reload: () => void
}) => {
  const gameSystem = cell.row.original
  const [modifyGameSystem, setModifyGameSystem] = useState<GameSystem | null>(
    null
  )
  const [isOpenModifyModal, setIsOpenModifyModal] = useState(false)
  const openModifyModal = (gameSystem: GameSystem) => {
    setModifyGameSystem(gameSystem)
    setIsOpenModifyModal(true)
  }
  const toggleModifyModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenModifyModal(!isOpenModifyModal)
    }
  }
  const postUpdate = useCallback(async (gameSystem: GameSystem) => {
    setIsOpenModifyModal(false)
    await reload()
  }, [])
  const modifiable = useAuth().isSignedIn

  return (
    <td className='w-8 td text-center'>
      <PrimaryButton
        className='py-1'
        click={() => openModifyModal(gameSystem)}
        disabled={!modifiable}
      >
        <FontAwesomeIcon icon={faPencil} />
      </PrimaryButton>
      {isOpenModifyModal && (
        <ModifyGameSystemModal
          toggleModal={toggleModifyModal}
          postSave={postUpdate}
          gameSystem={modifyGameSystem!}
        />
      )}
    </td>
  )
}
