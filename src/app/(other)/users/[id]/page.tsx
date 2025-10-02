'use client'

import {
  fetchUser,
  fetchUserParticipates,
  fetchUserRuleBooks,
  fetchUserScenarios
} from '@/components/api/user-api'
import PrimaryButton from '@/components/button/primary-button'
import SecondaryButton from '@/components/button/scondary-button'
import MarkdownNotification from '@/components/notification/markdown-notification'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import DeleteButton from './user-delete-button'
import UserIntroductionModifyButton from './user-introduction-modify-button'
import UserParticipates from './user-participates'

const UsersIdPage = ({ params }: { params: { id: string } }) => {
  const userIdStr = params.id
  const userId = userIdStr ? parseInt(userIdStr) : 0

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [participates, setParticipates] = useState<ParticipateResponse[]>([])
  const [scenarios, setScenarios] = useState<ScenarioResponse[]>([])
  const [ruleBooks, setRuleBooks] = useState<RuleBookResponse[]>([])

  const reloadUser = async () => {
    const u = await fetchUser(userId)
    setUser(u)
  }
  const reloadParticipates = async () => {
    const p = await fetchUserParticipates(userId)
    setParticipates(p.list)
  }
  const reloadScenarios = async () => {
    const s = await fetchUserScenarios(userId)
    setScenarios(s.list)
  }
  const reloadRuleBooks = async () => {
    const r = await fetchUserRuleBooks(userId)
    setRuleBooks(r.list)
  }

  useEffect(() => {
    const fetch = async () => {
      await reloadUser()
      await Promise.all([
        reloadParticipates(),
        reloadScenarios(),
        reloadRuleBooks()
      ])
      setLoading(false)
    }
    fetch()
  }, [userId])

  const title = useMemo(() => {
    let t = 'Scenario Tuker | ユーザー情報'
    if (!user) return t
    return t + ` | ${user.name}`
  }, [user])

  if (loading) {
    return (
      <div className='w-full min-h-screen relative flex justify-center'>
        <p className='my-auto'>読み込み中...</p>
      </div>
    )
  }
  if (!user) {
    return <div>存在しないユーザーです。</div>
  }

  return (
    <div>
      <title>{title}</title>
      <div>
        <h1>
          {user.name}
          {user.twitter && (
            <Link
              className='ml-2'
              href={`https://twitter.com/${user.twitter?.screen_name}`}
              target='_blank'
            >
              <PrimaryButton className='py-0'>
                <FontAwesomeIcon icon={faTwitter} className='h-4' />
              </PrimaryButton>
            </Link>
          )}
        </h1>
        <UserIntroductionModifyButton user={user} reload={reloadUser} />
        {user.introduction && (
          <MarkdownNotification className='mt-6'>
            {user.introduction}
          </MarkdownNotification>
        )}
        <div className='mt-6'>
          <UserParticipates
            user={user}
            participates={participates}
            scenarios={scenarios}
            ruleBooks={ruleBooks}
            reloadParticipates={reloadParticipates}
            reloadScenarios={reloadScenarios}
            reloadRuleBooks={reloadRuleBooks}
          />
        </div>
      </div>
      <div className='mt-8'>
        <DeleteButton user={user} />
      </div>
      <div className='mt-8'>
        <Link href='/users'>
          <SecondaryButton>ユーザー検索</SecondaryButton>
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

export default UsersIdPage
