import { DisclosureRange } from '@/@types/disclosure-range'
import { fetchParticipateImpression } from '@/components/api/participate-api'
import { useAuth } from '@/components/auth/use-auth'
import PrimaryButton from '@/components/button/primary-button'
import WarnButton from '@/components/button/warn-button'
import Modal from '@/components/modal/modal'
import MarkdownNotification from '@/components/notification/markdown-notification'
import { getSortIcon } from '@/components/table/header'
import {
  faComment,
  faExternalLink,
  faShare
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Cell, Column, ColumnDef, Row } from '@tanstack/react-table'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'

export type DisplayParticipate = ParticipateResponse & {}

export const sortableHeader =
  (headerName: string) =>
  ({ column }: { column: Column<DisplayParticipate, any> }): JSX.Element => {
    return (
      <div
        className='cursor-pointer'
        onClick={column.getToggleSortingHandler()}
      >
        {headerName}&nbsp;{getSortIcon(column.getIsSorted())}
      </div>
    )
  }

export const ScenarioNameColumn = ({
  cell
}: {
  cell: Cell<DisplayParticipate, unknown>
}) => {
  const scenario = cell.row.original.scenario
  return (
    <ParticipatesTableColumn cell={cell} className='text-left'>
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
    </ParticipatesTableColumn>
  )
}

export const ParticipatesTableColumn = ({
  cell,
  className,
  children
}: {
  cell: Cell<DisplayParticipate, unknown>
  className?: string
  children: React.ReactNode
}) => {
  return (
    <td key={cell.id} className={`td ${className}`}>
      {children}
    </td>
  )
}

export const ParticipatesTableSimpleColumn = ({
  cell,
  className
}: {
  cell: Cell<DisplayParticipate, unknown>
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
    <ParticipatesTableColumn
      cell={cell}
      className={`${classNames} ${className ?? ''}`}
    >
      {cell.getValue() as React.ReactNode}
    </ParticipatesTableColumn>
  )
}

export const GameSystemsColumn = ({
  cell
}: {
  cell: Cell<DisplayParticipate, unknown>
}) => {
  const gameSystems = cell.row.original.scenario.game_systems
  return (
    <ParticipatesTableColumn cell={cell} className='text-left'>
      {gameSystems.map((gameSystem, idx) => (
        <span key={idx}>
          <Link href={`/game-systems/${gameSystem.id}`}>{gameSystem.name}</Link>
          {gameSystems.length - 1 !== idx && <>、</>}
        </span>
      ))}
    </ParticipatesTableColumn>
  )
}

export const UserColumn = ({
  cell
}: {
  cell: Cell<DisplayParticipate, unknown>
}) => {
  const user = cell.row.original.user
  return (
    <ParticipatesTableColumn cell={cell} className='text-left'>
      <Link href={`/users/${user.id}`}>{user.name}</Link>
    </ParticipatesTableColumn>
  )
}

export const RuleBooksColumn = ({
  cell
}: {
  cell: Cell<DisplayParticipate, unknown>
}) => {
  const ruleBooks = cell.row.original.rule_books
  return (
    <ParticipatesTableColumn cell={cell} className='text-left'>
      {ruleBooks.map((ruleBook, idx) => (
        <span key={idx}>
          <Link href={`/rule-books/${ruleBook.id}`}>{ruleBook.name}</Link>
          {ruleBooks.length - 1 !== idx && <>、</>}
        </span>
      ))}
    </ParticipatesTableColumn>
  )
}

export const ImpressionColumn = ({
  cell
}: {
  cell: Cell<DisplayParticipate, unknown>
}) => {
  const participate = cell.row.original
  const impression = participate.impression
  if (!impression) {
    return <ParticipatesTableColumn cell={cell}>{''}</ParticipatesTableColumn>
  }

  const hasSpoiler = impression.has_spoiler
  const auth = useAuth()
  const canView = useMemo(() => {
    if (impression.disclosure_range === DisclosureRange.Everyone.value) {
      return true
    } else if (impression.disclosure_range === DisclosureRange.OnlyMe.value) {
      // 自分だけ見られる
      return auth.myself?.id === participate.user.id
    }
  }, [participate, auth.myself?.id])

  const [impressionContent, setImpressionContent] = useState<string | null>(
    null
  )
  const [isShowModal, setIsShowModal] = useState(false)
  const openModal = () => {
    setIsShowModal(true)
  }
  const toggleModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsShowModal(!isShowModal)
    }
  }

  const confirmToOpenImpressionModal = async () => {
    // ネタバレありの場合、警告を表示
    if (hasSpoiler) {
      if (
        !window.confirm('この感想はネタバレが含まれます。内容を表示しますか？')
      ) {
        return
      }
    }
    // 閲覧できるかサーバー側でチェックする
    const res = await fetchParticipateImpression(participate.id)
    if (res) {
      setImpressionContent(res.content)
      openModal()
    } else {
      alert('あなたはこの感想を閲覧できません。')
    }
  }

  const share = () => {
    const scenarioName = participate.scenario.name
    const range = participate.impression?.disclosure_range
    const hasSpoiler = participate.impression?.has_spoiler
      ? 'ネタバレ含む'
      : 'ネタバレなし'
    let url = 'https://twitter.com/share?text='
    url += encodeURIComponent(`${scenarioName}\n${hasSpoiler}\n`)
    url += `&url=${encodeURIComponent(`${window.location.origin}/scenario-tuker/participates/${participate.id}`)}`
    url += `&hashtags=${encodeURIComponent('ScenarioTuker')}`
    window.open(url)
  }

  return (
    <ParticipatesTableColumn cell={cell} className='text-left'>
      <>
        {hasSpoiler ? (
          <WarnButton
            className='py-1'
            click={confirmToOpenImpressionModal}
            disabled={!canView}
          >
            <FontAwesomeIcon icon={faComment} />
          </WarnButton>
        ) : (
          <PrimaryButton
            className='py-1'
            click={confirmToOpenImpressionModal}
            disabled={!canView}
          >
            <FontAwesomeIcon icon={faComment} />
          </PrimaryButton>
        )}
        {isShowModal && (
          <ImpressionModal
            participate={participate}
            impressionContent={impressionContent}
            toggleModal={toggleModal}
          />
        )}
        {impression.disclosure_range === DisclosureRange.Everyone.value && (
          <PrimaryButton click={share} className='py-1 ml-1'>
            <FontAwesomeIcon icon={faShare} />
          </PrimaryButton>
        )}
      </>
    </ParticipatesTableColumn>
  )
}

export const ScenarioNameColumnDef: ColumnDef<DisplayParticipate, any> = {
  accessorKey: 'name',
  header: sortableHeader('シナリオ'),
  cell: ({ cell }) => <ScenarioNameColumn cell={cell} />,
  sortingFn: (rowA: Row<DisplayParticipate>, rowB: Row<DisplayParticipate>) => {
    return rowA.original.scenario.name.localeCompare(
      rowB.original.scenario.name
    )
  },
  filterFn: (row: Row<ParticipateResponse>, _: string, filterValue: string) => {
    return row.original.scenario.name.includes(filterValue)
  }
}
export const GameSystemsColumnDef: ColumnDef<DisplayParticipate, any> = {
  accessorKey: 'game_system',
  header: sortableHeader('ゲームシステム'),
  cell: ({ cell }) => <GameSystemsColumn cell={cell} />,
  sortingFn: (rowA: Row<DisplayParticipate>, rowB: Row<DisplayParticipate>) => {
    return (
      rowA.original.scenario?.game_systems
        ?.map((gs) => gs.name)
        .join()
        .localeCompare(
          rowB.original.scenario.game_systems?.map((gs) => gs.name).join() ?? ''
        ) ?? 0
    )
  },
  filterFn: (row: Row<ParticipateResponse>, _: string, filterValue: string) => {
    return (
      row.original.scenario.game_systems
        .map((gs) => gs.name)
        ?.includes(filterValue) ?? false
    )
  }
}
export const RuleBooksColumnDef: ColumnDef<DisplayParticipate, any> = {
  accessorKey: 'rule_books',
  header: sortableHeader('ルールブック'),
  cell: ({ cell }) => <RuleBooksColumn cell={cell} />,
  filterFn: (row: Row<ParticipateResponse>, _: string, filterValue: string) => {
    return row.original.rule_books.some((rb) => rb.name.includes(filterValue))
  }
}
export const UserColumnDef: ColumnDef<DisplayParticipate, any> = {
  accessorKey: 'user',
  header: sortableHeader('ユーザー'),
  cell: ({ cell }) => {
    return <UserColumn cell={cell} />
  },
  sortingFn: (rowA: Row<DisplayParticipate>, rowB: Row<DisplayParticipate>) => {
    return rowA.original.user.name.localeCompare(rowB.original.user.name)
  },
  filterFn: (row: Row<ParticipateResponse>, _: string, filterValue: string) => {
    return row.original.user.name.includes(filterValue)
  }
}
export const RoleColumnDef: ColumnDef<DisplayParticipate, any> = {
  accessorKey: 'role',
  header: sortableHeader('役割'),
  cell: ({ cell }) => <ParticipatesTableSimpleColumn cell={cell} />
}
export const TermNameColumnDef: ColumnDef<DisplayParticipate, any> = {
  accessorKey: 'term_name',
  header: sortableHeader('日程'),
  cell: ({ cell }) => <ParticipatesTableSimpleColumn cell={cell} />,
  sortingFn: (rowA: Row<DisplayParticipate>, rowB: Row<DisplayParticipate>) => {
    const aTerm = rowA.original.term
    const a =
      aTerm?.from != null ? aTerm.from : aTerm?.to != null ? aTerm.to : ''
    const bTerm = rowB.original.term
    const b =
      bTerm?.from != null ? bTerm.from : bTerm?.to != null ? bTerm.to : ''
    return a.localeCompare(b)
  }
}
export const RequiredHoursColumnDef: ColumnDef<DisplayParticipate, any> = {
  accessorKey: 'required_hours_label',
  header: sortableHeader('プレイ時間'),
  cell: ({ cell }) => (
    <ParticipatesTableSimpleColumn className='text-right' cell={cell} />
  )
}
export const PlayerNumNameColumnDef: ColumnDef<DisplayParticipate, any> = {
  accessorKey: 'player_num_name',
  header: sortableHeader('PL人数'),
  cell: ({ cell }) => (
    <ParticipatesTableSimpleColumn className='text-right w-16' cell={cell} />
  )
}
export const GameMasterNameColumnDef: ColumnDef<DisplayParticipate, any> = {
  accessorKey: 'game_master_name',
  header: sortableHeader('GM'),
  cell: ({ cell }) => <ParticipatesTableSimpleColumn cell={cell} />
}
export const PlayerNamesColumnDef: ColumnDef<DisplayParticipate, any> = {
  accessorKey: 'player_names_label',
  header: sortableHeader('参加PL'),
  cell: ({ cell }) => (
    <ParticipatesTableSimpleColumn
      className='min-w-[200px] break-words whitespace-normal'
      cell={cell}
    />
  )
}
export const MemoColumnDef: ColumnDef<DisplayParticipate, any> = {
  accessorKey: 'memo',
  header: sortableHeader('ひとことメモ'),
  cell: ({ cell }) => (
    <ParticipatesTableSimpleColumn
      className='min-w-[400px] break-words whitespace-normal'
      cell={cell}
    />
  )
}
export const ImpressionColumnDef: ColumnDef<DisplayParticipate, any> = {
  accessorKey: 'impression',
  header: sortableHeader('感想'),
  cell: ({ cell }) => <ImpressionColumn cell={cell} />,
  sortingFn: (rowA: Row<DisplayParticipate>, rowB: Row<DisplayParticipate>) => {
    const existsA = rowA.original.impression !== null
    const existsB = rowB.original.impression !== null
    if (existsA && existsB) return 0
    else if (existsA) return -1
    else return 1
  },
  enableColumnFilter: false
}

export const convertToDisplayParticipates = (
  participates: ParticipateResponse[]
): DisplayParticipate[] => {
  return participates.map((p: ParticipateResponse) => {
    return {
      ...p,
      role: p.role_names.join('、'),
      term_name: convertToTermName(p),
      player_num_name: p.player_num ? `${p.player_num}人` : '',
      game_master_name: p.game_master || '',
      required_hours_label: p.required_hours ? `${p.required_hours}時間` : '',
      player_names_label: p.player_names || ''
    } as DisplayParticipate
  })
}

const convertToTermName = (participate: ParticipateResponse): string => {
  const term = participate.term
  if (!term) {
    return ''
  }
  const from = term.from
  const to = term.to
  if (from && to) {
    return `${from} 〜 ${to}`
  } else if (from) {
    return `${from} 〜`
  } else if (to) {
    return `〜 ${to}`
  }
  return ''
}

const ImpressionModal = ({
  participate,
  impressionContent,
  toggleModal
}: {
  participate: ParticipateResponse
  impressionContent: string | null
  toggleModal: (e: any) => void
}) => {
  if (!impressionContent) {
    return <></>
  }
  return (
    <Modal close={toggleModal}>
      <>
        <h2>シナリオ「{participate.scenario.name}」の感想</h2>
        <div className='my-6'>
          <p>役割: {participate.role_names.join('、')}</p>
        </div>
        <MarkdownNotification>{impressionContent}</MarkdownNotification>
      </>
    </Modal>
  )
}
