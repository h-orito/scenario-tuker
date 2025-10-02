'use client'

import PrimaryButton from '@/components/button/primary-button'
import { Filter } from '@/components/table/header'
import PaginationFooter from '@/components/table/pagination-footer'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Cell,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  useReactTable
} from '@tanstack/react-table'
import Link from 'next/link'
import React, { useMemo } from 'react'

type Props = {
  users: User[]
}

const UsersTable = ({ users }: Props) => {
  const columns: ColumnDef<User, any>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'ユーザー',
        cell: ({ cell }) => <UserNameColumn cell={cell} />,
        sortingFn: (rowA: Row<User>, rowB: Row<User>) => {
          return rowA.original.name.localeCompare(rowB.original.name)
        },
        filterFn: (row: Row<User>, _: string, filterValue: string) => {
          return row.original.name.includes(filterValue)
        }
      },
      {
        accessorKey: 'twitter',
        header: 'Twitter',
        cell: ({ cell }) => <TwitterColumn cell={cell} />,
        enableColumnFilter: false
      }
    ],
    []
  )
  const table = useReactTable<User>({
    data: users,
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
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <React.Fragment key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </React.Fragment>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {users.length > 0 && (
        <div className='border-x border-b border-slate-300 px-2 py-2 bg-gray-100 text-xs'>
          <PaginationFooter table={table} />
        </div>
      )}
    </div>
  )
}

const UserNameColumn = ({ cell }: { cell: Cell<User, unknown> }) => {
  const user = cell.row.original
  console.log(user)
  return (
    <td key={cell.id} className='td text-left'>
      <Link href={`/users/${user.id}`}>{user.name}</Link>
    </td>
  )
}

const TwitterColumn = ({ cell }: { cell: Cell<User, unknown> }) => {
  const user = cell.row.original
  return (
    <td key={cell.id} className='w-8 td text-center'>
      {user.twitter ? (
        <Link
          href={`https://twitter.com/${user.twitter.screen_name}`}
          target='_blank'
        >
          <PrimaryButton>
            <FontAwesomeIcon icon={faTwitter} />
          </PrimaryButton>
        </Link>
      ) : (
        ''
      )}
    </td>
  )
}

export default UsersTable
