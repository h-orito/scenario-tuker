import { AllRuleBookType } from '@/@types/rule-book-type'
import { Cell, ColumnDef, flexRender } from '@tanstack/react-table'
import Link from 'next/link'

export type DisplayRuleBook = RuleBookResponse & {
  game_system_name: string | null
  rule_book_type_label: string | null
}

export const baseRuleBooksTableColumns: ColumnDef<DisplayRuleBook, any>[] = [
  {
    accessorKey: 'name',
    header: 'ルールブック名'
  },
  {
    accessorKey: 'game_system_name',
    header: 'ゲームシステム名'
  },
  {
    accessorKey: 'rule_book_type_label',
    header: '種別'
  }
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
  cell
}: {
  cell: Cell<DisplayRuleBook, unknown>
}) => {
  return (
    <RuleBooksTableColumn cell={cell} className='text-left'>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </RuleBooksTableColumn>
  )
}

export const RuleBookTableRuleBookNameColumn = ({
  cell
}: {
  cell: Cell<DisplayRuleBook, unknown>
}) => {
  return (
    <RuleBooksTableColumn cell={cell} className='text-left'>
      <Link href={`/rule-books/${cell.row.original.id}`}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </Link>
    </RuleBooksTableColumn>
  )
}

export const RuleBookTableGameSystemColumn = ({
  cell
}: {
  cell: Cell<DisplayRuleBook, unknown>
}) => {
  return (
    <RuleBooksTableColumn cell={cell} className='text-left'>
      <Link href={`/game-systems/${cell.row.original.game_system.id}`}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </Link>
    </RuleBooksTableColumn>
  )
}
