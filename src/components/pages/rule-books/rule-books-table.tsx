import { AllRuleBookType } from '@/@types/rule-book-type'
import { getSortIcon } from '@/components/table/header'
import { Cell, Column, ColumnDef, Row } from '@tanstack/react-table'
import Link from 'next/link'

export type DisplayRuleBook = RuleBookResponse & {
  game_system_name: string | null
  rule_book_type_label: string | null
}

const sortableHeader =
  (headerName: string) =>
  ({ column }: { column: Column<DisplayRuleBook, any> }): JSX.Element => {
    return (
      <div
        className='cursor-pointer'
        onClick={column.getToggleSortingHandler()}
      >
        {headerName}&nbsp;{getSortIcon(column.getIsSorted())}
      </div>
    )
  }

export const RuleBooksTableColumn = ({
  cell,
  className,
  children
}: {
  cell: Cell<DisplayRuleBook, unknown>
  className?: string
  children: React.ReactNode
}) => {
  return (
    <td key={cell.id} className={`td ${className}`}>
      {children}
    </td>
  )
}

export const RuleBooksTableSimpleColumn = ({
  cell,
  className
}: {
  cell: Cell<DisplayRuleBook, unknown>
  className?: string
}) => {
  let classNames = ''
  if (
    !className?.includes('text-right') &&
    !className?.includes('text-center')
  ) {
    classNames += 'text-left'
  }
  return (
    <RuleBooksTableColumn
      cell={cell}
      className={`${classNames} ${className ?? ''}`}
    >
      {cell.getValue() as React.ReactNode}
    </RuleBooksTableColumn>
  )
}

export const RuleBookTableRuleBookNameColumn = ({
  cell
}: {
  cell: Cell<DisplayRuleBook, unknown>
}) => {
  const ruleBook = cell.row.original
  return (
    <RuleBooksTableColumn cell={cell} className='text-left'>
      <Link href={`/rule-books/${ruleBook.id}`}>{ruleBook.name}</Link>
    </RuleBooksTableColumn>
  )
}

export const RuleBookTableGameSystemColumn = ({
  cell
}: {
  cell: Cell<DisplayRuleBook, unknown>
}) => {
  const gameSystem = cell.row.original.game_system
  return (
    <RuleBooksTableColumn cell={cell} className='text-left'>
      <Link href={`/game-systems/${gameSystem.id}`}>{gameSystem.name}</Link>
    </RuleBooksTableColumn>
  )
}

export const RuleBookNameColumnDef: ColumnDef<DisplayRuleBook, any> = {
  accessorKey: 'name',
  header: sortableHeader('ルールブック名'),
  cell: ({ cell }) => <RuleBookTableRuleBookNameColumn cell={cell} />,
  sortingFn: (rowA: Row<DisplayRuleBook>, rowB: Row<DisplayRuleBook>) => {
    return rowA.original.name.localeCompare(rowB.original.name)
  },
  filterFn: (row: Row<DisplayRuleBook>, _: string, filterValue: string) => {
    return row.original.name.includes(filterValue)
  }
}
export const GameSystemNameColumnDef: ColumnDef<DisplayRuleBook, any> = {
  accessorKey: 'game_system_name',
  header: sortableHeader('ゲームシステム名'),
  cell: ({ cell }) => <RuleBookTableGameSystemColumn cell={cell} />,
  sortingFn: (rowA: Row<DisplayRuleBook>, rowB: Row<DisplayRuleBook>) => {
    return (
      rowA.original.game_system_name?.localeCompare(
        rowB.original.game_system_name ?? ''
      ) ?? 0
    )
  },
  filterFn: (row: Row<DisplayRuleBook>, _: string, filterValue: string) => {
    return row.original.game_system_name?.includes(filterValue) ?? false
  }
}
export const RuleBookTypeColumnDef: ColumnDef<DisplayRuleBook, any> = {
  accessorKey: 'rule_book_type_label',
  header: sortableHeader('種別'),
  cell: ({ cell }) => <RuleBooksTableSimpleColumn cell={cell} />
}
export const baseRuleBooksTableColumns: ColumnDef<DisplayRuleBook, any>[] = [
  RuleBookNameColumnDef,
  GameSystemNameColumnDef,
  RuleBookTypeColumnDef
]

export const convertToDisplayRuleBooks = (
  ruleBooks: RuleBookResponse[]
): DisplayRuleBook[] => {
  return ruleBooks.map((r) => {
    return {
      ...r,
      game_system_name: r.game_system ? r.game_system.name : null,
      rule_book_type_label:
        AllRuleBookType.find((t) => t.value === r.type)?.label ?? null
    } as DisplayRuleBook
  })
}
