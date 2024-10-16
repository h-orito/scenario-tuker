'use client'

import { AllGameMasterRequirementType } from '@/@types/game-master-requirement-type'
import { AllScenarioType } from '@/@types/scenario-type'
import { Cell, ColumnDef, flexRender } from '@tanstack/react-table'
import Link from 'next/link'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLink } from '@fortawesome/free-solid-svg-icons'

export type DisplayScenario = ScenarioResponse & {
  type_label: string | null
  game_master: string | null
  player_num: string | null
  required_hours_label: string | null
}

export const baseScenarioTableColumns: ColumnDef<DisplayScenario, any>[] = [
  {
    accessorKey: 'name',
    header: 'シナリオ名'
  },
  {
    accessorKey: 'type_label',
    header: '種別'
  },
  {
    accessorKey: 'game_system',
    header: 'ゲームシステム'
  },
  {
    accessorKey: 'authors',
    header: '製作者'
  },
  {
    accessorKey: 'game_master',
    header: 'GM'
  },
  {
    accessorKey: 'player_num',
    header: 'PL人数'
  },
  {
    accessorKey: 'required_hours_label',
    header: 'プレイ時間目安'
  },
  {
    accessorKey: 'participate_count',
    header: '通過数'
  }
]

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
  cell
}: {
  cell: Cell<DisplayScenario, unknown>
}) => {
  return (
    <ScenariosTableColumn cell={cell} className='text-left'>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </ScenariosTableColumn>
  )
}

export const ScenarioNameColumn = ({
  cell
}: {
  cell: Cell<DisplayScenario, unknown>
}) => {
  return (
    <ScenariosTableColumn cell={cell} className='text-left'>
      <Link href={`/scenarios/${cell.row.original.id}`}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </Link>
      {cell.row.original.url && (
        <span className='ml-2'>
          <span>（</span>
          <Link href={cell.row.original.url} target='_blank'>
            公式
            <FontAwesomeIcon icon={faExternalLink} className='ml-1' />
          </Link>
          <span>）</span>
        </span>
      )}
    </ScenariosTableColumn>
  )
}

export const GameSystemColumn = ({
  cell
}: {
  cell: Cell<DisplayScenario, unknown>
}) => {
  return (
    <ScenariosTableColumn cell={cell} className='text-left'>
      {cell.row.original.game_system ? (
        <Link href={`/game-systems/${cell.row.original.game_system!.id}`}>
          {cell.row.original.game_system!.name}
        </Link>
      ) : (
        ''
      )}
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
