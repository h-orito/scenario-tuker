'use client'

import { AllGameMasterRequirementType } from '@/@types/game-master-requirement-type'
import { AllScenarioType } from '@/@types/scenario-type'
import { getSortIcon } from '@/components/table/header'
import { faExternalLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Cell, Column, ColumnDef, Row } from '@tanstack/react-table'
import Link from 'next/link'
import React from 'react'

export type DisplayScenario = ScenarioResponse & {
  type_label: string | null
  game_master: string | null
  player_num: string | null
  required_hours_label: string | null
}

const sortableHeader =
  (headerName: string) =>
  ({ column }: { column: Column<DisplayScenario, any> }): JSX.Element => {
    return (
      <div
        className='cursor-pointer'
        onClick={column.getToggleSortingHandler()}
      >
        {headerName}&nbsp;{getSortIcon(column.getIsSorted())}
      </div>
    )
  }

export const ScenariosTableColumn = ({
  cell,
  className,
  children
}: {
  cell: Cell<DisplayScenario, unknown>
  className?: string
  children: React.ReactNode
}) => {
  return (
    <td key={cell.id} className={`td ${className}`}>
      {children}
    </td>
  )
}

export const ScenariosTableSimpleColumn = ({
  cell,
  className
}: {
  cell: Cell<DisplayScenario, unknown>
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
    <ScenariosTableColumn
      cell={cell}
      className={`${classNames} ${className ?? ''}`}
    >
      {cell.getValue() as React.ReactNode}
    </ScenariosTableColumn>
  )
}

export const ScenarioNameColumn = ({
  cell
}: {
  cell: Cell<DisplayScenario, unknown>
}) => {
  const scenario = cell.row.original
  return (
    <ScenariosTableColumn cell={cell} className='text-left'>
      <div className='flex'>
        <Link href={`/scenarios/${scenario.id}`}>{scenario.name}</Link>
        {scenario.url && (
          <span className='ml-auto'>
            <span>（</span>
            <Link href={scenario.url} target='_blank'>
              公式
              <FontAwesomeIcon icon={faExternalLink} className='ml-1 h-3' />
            </Link>
            <span>）</span>
          </span>
        )}
      </div>
    </ScenariosTableColumn>
  )
}

export const GameSystemsColumn = ({
  cell
}: {
  cell: Cell<DisplayScenario, unknown>
}) => {
  const gameSystems = cell.row.original.game_systems
  return (
    <ScenariosTableColumn cell={cell} className='text-left'>
      {gameSystems.map((gameSystem, idx) => (
        <span key={idx}>
          <Link href={`/game-systems/${gameSystem.id}`}>{gameSystem.name}</Link>
          {idx < gameSystems.length - 1 && '、'}
        </span>
      ))}
    </ScenariosTableColumn>
  )
}

export const AuthorsColumn = ({
  cell
}: {
  cell: Cell<DisplayScenario, unknown>
}) => {
  const authors = cell.row.original.authors
  return (
    <ScenariosTableColumn cell={cell} className='text-left'>
      {authors.map((author, idx) => (
        <span key={idx}>
          <Link href={`/authors/${author.id}`}>{author.name}</Link>
          {idx < authors.length - 1 && '、'}
        </span>
      ))}
    </ScenariosTableColumn>
  )
}

export const ScenarioNameColumnDef: ColumnDef<DisplayScenario, any> = {
  accessorKey: 'name',
  header: sortableHeader('シナリオ名'),
  cell: ({ cell }) => <ScenarioNameColumn cell={cell} />,
  sortingFn: (rowA: Row<DisplayScenario>, rowB: Row<DisplayScenario>) => {
    return rowA.original.name.localeCompare(rowB.original.name)
  },
  filterFn: (row: Row<DisplayScenario>, _: string, filterValue: string) => {
    return row.original.name.includes(filterValue)
  }
}
export const TypeColumnDef: ColumnDef<DisplayScenario, any> = {
  accessorKey: 'type_label',
  header: sortableHeader('種別'),
  cell: ({ cell }) => <ScenariosTableSimpleColumn cell={cell} />
}
export const GameSystemsColumnDef: ColumnDef<DisplayScenario, any> = {
  accessorKey: 'game_systems',
  header: sortableHeader('ゲームシステム'),
  cell: ({ cell }) => <GameSystemsColumn cell={cell} />,
  sortingFn: (rowA: Row<DisplayScenario>, rowB: Row<DisplayScenario>) => {
    return rowA.original.game_systems
      .map((gs) => gs.name)
      .join(',')
      .localeCompare(
        rowB.original.game_systems.map((gs) => gs.name).join(',') ?? ''
      )
  },
  filterFn: (row: Row<DisplayScenario>, _: string, filterValue: string) => {
    return row.original.game_systems
      .map((gs) => gs.name)
      .join(',')
      .includes(filterValue)
  }
}
export const AuthorsColumnDef: ColumnDef<DisplayScenario, any> = {
  accessorKey: 'authors',
  header: sortableHeader('製作者'),
  cell: ({ cell }) => <AuthorsColumn cell={cell} />,
  sortingFn: (rowA: Row<DisplayScenario>, rowB: Row<DisplayScenario>) => {
    return rowA.original.authors
      .map((a) => a.name)
      .join(',')
      .localeCompare(rowB.original.authors.map((a) => a.name).join(',') ?? '')
  },
  filterFn: (row: Row<DisplayScenario>, _: string, filterValue: string) => {
    return row.original.authors
      .map((a) => a.name)
      .join(',')
      .includes(filterValue)
  }
}
export const GameMasterColumnDef: ColumnDef<DisplayScenario, any> = {
  accessorKey: 'game_master',
  header: sortableHeader('GM'),
  cell: ({ cell }) => (
    <ScenariosTableSimpleColumn className='w-16' cell={cell} />
  )
}
export const PlayerNumColumnDef: ColumnDef<DisplayScenario, any> = {
  accessorKey: 'player_num',
  header: sortableHeader('PL人数'),
  cell: ({ cell }) => (
    <ScenariosTableSimpleColumn className='text-right w-16' cell={cell} />
  ),
  filterFn: (row: Row<DisplayScenario>, _: string, filterValue: string) => {
    const min = row.original.player_num_min
    const max = row.original.player_num_max
    if (!min && !max) return false
    const val = parseInt(filterValue)
    if (min) {
      if (min > val) return false
    }
    if (max) {
      if (max < val) return false
    }
    return true
  },
  sortingFn: (rowA: Row<DisplayScenario>, rowB: Row<DisplayScenario>) => {
    const minA = rowA.original.player_num_min
    const maxA = rowA.original.player_num_max
    const a = minA || maxA || 0
    const minB = rowB.original.player_num_min
    const maxB = rowB.original.player_num_max
    const b = minB || maxB || 0
    return a - b
  }
}
export const RequiredHoursColumnDef: ColumnDef<DisplayScenario, any> = {
  accessorKey: 'required_hours_label',
  header: sortableHeader('プレイ時間目安'),
  cell: ({ cell }) => (
    <ScenariosTableSimpleColumn className='text-right w-24' cell={cell} />
  ),
  filterFn: (row: Row<DisplayScenario>, _: string, filterValue: string) => {
    if (!row.original.required_hours) return false
    const val = parseInt(filterValue)
    // 入力値に収まる時間のもののみにする
    return row.original.required_hours <= val
  },
  sortingFn: (rowA: Row<DisplayScenario>, rowB: Row<DisplayScenario>) => {
    return (
      (rowB.original.required_hours ?? 0) - (rowA.original.required_hours ?? 0)
    )
  }
}
export const ParticipateCountColumnDef: ColumnDef<DisplayScenario, any> = {
  accessorKey: 'participate_count',
  header: sortableHeader('通過数'),
  cell: ({ cell }) => (
    <ScenariosTableSimpleColumn className='text-right' cell={cell} />
  ),
  filterFn: (row: Row<DisplayScenario>, _: string, filterValue: string) => {
    if (!row.original.participate_count) return false
    const val = parseInt(filterValue)
    // 入力値より通過数が多いもののみにする
    return row.original.participate_count >= val
  },
  sortingFn: (rowA: Row<DisplayScenario>, rowB: Row<DisplayScenario>) => {
    return (
      (rowB.original.participate_count ?? 0) -
      (rowA.original.participate_count ?? 0)
    )
  }
}

export const convertToDisplayScenarios = (
  scenarios: ScenarioResponse[]
): DisplayScenario[] => {
  return scenarios.map((s) => {
    return {
      ...s,
      type_label:
        AllScenarioType.find((st) => st.value === s.type)?.label ?? null,
      game_master: s.game_master_requirement
        ? (AllGameMasterRequirementType.find(
            (gm) => gm.value === s.game_master_requirement
          )?.label ?? null)
        : null,
      player_num: playerNum(s),
      required_hours_label: s.required_hours ? `${s.required_hours}時間` : null
    } as DisplayScenario
  })
}

const playerNum = (s: ScenarioResponse): string | null => {
  const min = s.player_num_min
  const max = s.player_num_max
  if (!min && !max) return null
  if (min === max) return `${min}人`
  if (!max) return `${min}人～`
  if (!min) return `～${max}人`
  return `${min}～${max}人`
}
