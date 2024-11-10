'use client'

import { fetchRuleBooks } from '@/components/api/rule-book-api'
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
  baseRuleBooksTableColumns,
  convertToDisplayRuleBooks,
  DisplayRuleBook,
  RuleBooksTableColumn
} from './rule-books-table'

type Props = {
  toggleModal: (e: any) => void
  closeModal: () => void
  setSelected: (value: RuleBookResponse[]) => void
}

const ScenariosSearch = ({ toggleModal, closeModal, setSelected }: Props) => {
  const [ruleBooks, setRuleBooks] = useState<RuleBookResponse[]>([])
  const [selecting, setSelecting] = useState<RuleBookResponse[]>([])

  useEffect(() => {
    const fetch = async () => {
      const res = await fetchRuleBooks()
      setRuleBooks(res.list)
    }
    fetch()
  }, [])

  const displayRuleBooks = useMemo(() => {
    return convertToDisplayRuleBooks(ruleBooks)
  }, [convertToDisplayRuleBooks, ruleBooks])

  const handleAdd = (ruleBook: RuleBookResponse) => {
    const newSelectings = selecting.concat(ruleBook)
    setSelecting(newSelectings)
  }

  const handleRemove = (ruleBook: RuleBookResponse) => {
    const newSelectings = selecting.filter((s) => s.id !== ruleBook.id)
    setSelecting(newSelectings)
  }

  const decide = () => {
    setSelected(selecting)
    closeModal()
  }

  const columns: ColumnDef<DisplayRuleBook, any>[] = useMemo(
    () => [
      {
        accessorKey: 'select',
        header: '選択',
        cell: ({ cell }) => (
          <AddColumn
            cell={cell}
            remove={handleRemove}
            add={handleAdd}
            selecting={selecting}
          />
        ),
        enableColumnFilter: false
      },
      ...baseRuleBooksTableColumns
    ],
    [selecting]
  )

  const table = useReactTable<DisplayRuleBook>({
    data: displayRuleBooks,
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
          <p>選択中のルールブック</p>
          <NormalNotification className='text-xs'>
            <ul className='list-disc text-left'>
              {selecting.map((r) => (
                <li key={r.id}>{r.name}</li>
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
          {displayRuleBooks.length > 0 && (
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
  cell: Cell<DisplayRuleBook, any>
  add: (ruleBook: RuleBookResponse) => void
  remove: (ruleBook: RuleBookResponse) => void
  selecting: RuleBookResponse[]
}) => {
  const exists = useMemo(
    () => selecting.some((s) => s.id === cell.row.original.id),
    [selecting, cell.row.original.id]
  )
  return (
    <RuleBooksTableColumn cell={cell} className='w-8'>
      {exists ? (
        <DangerButton className='py-1' click={() => remove(cell.row.original)}>
          削除
        </DangerButton>
      ) : (
        <PrimaryButton className='py-1' click={() => add(cell.row.original)}>
          追加
        </PrimaryButton>
      )}
    </RuleBooksTableColumn>
  )
}
