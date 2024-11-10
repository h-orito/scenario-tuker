'use client'

import { DisclosureRange } from '@/@types/disclosure-range'
import { AllScenarioType } from '@/@types/scenario-type'
import {
  fetchParticipate,
  fetchParticipateImpression
} from '@/components/api/participate-api'
import { useAuth } from '@/components/auth/use-auth'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/scondary-button'
import WarnButton from '@/components/button/warn-button'
import Modal from '@/components/modal/modal'
import useModalState from '@/components/modal/modal-state'
import MarkdownNotification from '@/components/notification/markdown-notification'
import NormalNotification from '@/components/notification/normal-notification'
import { faComment } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

const ParticipateIdPage = ({ params }: { params: { id: string } }) => {
  const participateIdStr = params.id
  const participateId = participateIdStr ? parseInt(participateIdStr) : 0
  const [participate, setParticipate] = useState<ParticipateResponse | null>(
    null
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const participate = await fetchParticipate(participateId)
      setParticipate(participate)
      setLoading(false)
    }
    fetch()
  }, [participateId])

  const title = useMemo(() => {
    const title = 'Participate Tuker | 通過記録'
    if (!participate) {
      return title
    }
    return `${title} | ${participate.scenario.name}`
  }, [participateId])

  const term = useMemo(() => {
    if (!participate || !participate.term) {
      return ''
    }
    const from = participate.term?.from
    const to = participate.term?.to
    if (from && to) {
      return `${from} ～ ${to}`
    } else if (from) {
      return `${from} ～`
    } else if (to) {
      return `～ ${to}`
    } else {
      return ''
    }
  }, [participate?.term])

  const [impressionContent, setImpressionContent] = useState<string | null>(
    null
  )
  const [isShowModal, openModal, , toggleModal] = useModalState()
  const auth = useAuth()
  const canView = useMemo(() => {
    if (!participate || !participate.impression) return false
    if (
      participate.impression.disclosure_range === DisclosureRange.Everyone.value
    ) {
      return true
    } else if (
      participate.impression.disclosure_range === DisclosureRange.OnlyMe.value
    ) {
      // 自分だけ見られる
      return auth.myself?.id === participate.user.id
    }
  }, [participate, auth.myself?.id])
  const confirmToOpenImpressionModal = async (e: any) => {
    if (!participate || !participate.impression) return

    // ネタバレありの場合、警告を表示
    if (participate?.impression?.has_spoiler) {
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
      openModal(e)
    } else {
      alert('あなたはこの感想を閲覧できません。')
    }
  }

  if (loading) {
    return (
      <div className='w-full min-h-screen relative flex justify-center'>
        <p className='my-auto'>読み込み中...</p>
      </div>
    )
  }
  if (!participate || !participate.scenario) {
    return <div>存在しない通過記録です。</div>
  }

  const scenarioType = AllScenarioType.find(
    (v) => v.value === participate.scenario.type
  )!

  return (
    <div>
      <title>{title}</title>
      <div>
        <h1>シナリオ: {participate.scenario.name} の通過記録</h1>
        <div className='my-6'>
          <p>{scenarioType.label}</p>
        </div>
        {participate.scenario.game_system && (
          <p className='mt-6'>
            <Link href={`/game-systems/${participate.scenario.game_system.id}`}>
              {participate.scenario.game_system.name}
            </Link>
          </p>
        )}
        <div className='my-6'>
          <p>
            ユーザー:{' '}
            <Link href={`/users/${participate.user.id}`} target='_blank'>
              {participate.user.name}
            </Link>
          </p>
        </div>
        <div className='my-6'>
          <p>役割: {participate.role_names.join('、')}</p>
        </div>
        {participate.rule_books.length > 0 && (
          <div className='my-6'>
            <p>
              ルールブック:{' '}
              {participate.rule_books.map((rb, idx) => {
                return (
                  <>
                    <Link href={`/rule-books/${rb.id}`} target='_blank'>
                      {rb.name}
                    </Link>
                    {idx !== participate.rule_books.length - 1 && '、'}
                  </>
                )
              })}
            </p>
          </div>
        )}
        {(term || participate.required_hours) && (
          <div className='my-6'>
            {term && <p>日程: {term}</p>}
            {participate.required_hours && (
              <p>所要時間: {participate.required_hours}時間</p>
            )}
          </div>
        )}
        {(participate.player_num ||
          participate.game_master ||
          participate.player_names) && (
          <div className='my-6'>
            {participate.player_num && (
              <p>PL人数: {participate.player_num}人</p>
            )}
            {participate.game_master && <p>GM: {participate.game_master}</p>}
            {participate.player_names && <p>PL: {participate.player_names}</p>}
          </div>
        )}
        {participate.memo && (
          <div className='my-6 flex justify-center'>
            <div className='w-full md:w-3/4'>
              <NormalNotification>
                <>
                  <p className='mb-4'>ひとことメモ</p>
                  {participate.memo}
                </>
              </NormalNotification>
            </div>
          </div>
        )}
        {participate.impression && (
          <div className='my-6 flex justify-center'>
            {participate.impression.has_spoiler ? (
              <WarnButton
                click={confirmToOpenImpressionModal}
                disabled={!canView}
              >
                <FontAwesomeIcon icon={faComment} className='mr-2' />
                感想
              </WarnButton>
            ) : (
              <PrimaryButton
                click={confirmToOpenImpressionModal}
                disabled={!canView}
              >
                <FontAwesomeIcon icon={faComment} className='mr-2' />
                感想
              </PrimaryButton>
            )}
            {isShowModal && (
              <ImpressionModal
                participate={participate}
                impressionContent={impressionContent}
                toggleModal={toggleModal}
              />
            )}
          </div>
        )}
      </div>
      <div className='mt-8'>
        <Link href={`/users/${participate.user.id}`}>
          <SecondaryButton>{participate.user.name} の通過記録</SecondaryButton>
        </Link>
      </div>
      <div className='mt-2'>
        <Link href='/'>
          <SecondaryButton>トップページ</SecondaryButton>
        </Link>
      </div>
    </div>
  )
}

export default ParticipateIdPage

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
