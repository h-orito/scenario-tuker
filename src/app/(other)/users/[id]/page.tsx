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
import DeleteButton from './user-delete-button'
import UserParticipates from './user-participates'

const UsersIdPage = async ({ params }: { params: { id: string } }) => {
  const userIdStr = params.id
  if (!userIdStr) {
    return <div>存在しないユーザーです。</div>
  }
  const userId = parseInt(userIdStr)
  const user = await fetchUser(userId)

  if (!user) {
    return <div>存在しないユーザーです。</div>
  }

  // 同時に取得開始
  const [participates, scenarios, ruleBooks] = await Promise.all([
    fetchUserParticipates(userId),
    fetchUserScenarios(userId),
    fetchUserRuleBooks(userId)
  ])

  return (
    <div>
      <div>
        <h1>
          {user.name}
          {user.twitter && (
            <Link
              className='ml-2'
              href={`https://twitter.com/${user.twitter?.screen_name}`}
              target='_blank'
            >
              <PrimaryButton className='py-1'>
                <FontAwesomeIcon icon={faTwitter} className='h-4' />
              </PrimaryButton>
            </Link>
          )}
        </h1>
        {user.introduction && (
          <MarkdownNotification className='mt-6'>
            {user.introduction}
          </MarkdownNotification>
        )}
        <div className='mt-6'>
          <UserParticipates
            user={user}
            participates={participates.list}
            scenarios={scenarios.list}
            ruleBooks={ruleBooks.list}
          />
        </div>
      </div>
      <div className='mt-8'>
        <DeleteButton />
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

export async function generateMetadata({ params }: { params: { id: string } }) {
  const userIdStr = params.id
  let title = 'Scenario Tuker | ユーザー情報'
  if (!userIdStr) {
    return { title }
  }
  const userId = parseInt(userIdStr)
  const user = await fetchUser(userId)
  if (user) {
    title += ` | ${user.name}`
  }

  return { title }
}
