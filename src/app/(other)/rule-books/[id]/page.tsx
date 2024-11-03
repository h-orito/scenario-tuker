import { AllRuleBookType } from '@/@types/rule-book-type'
import {
  fetchRuleBook,
  fetchRuleBookParticipates
} from '@/components/api/rule-book-api'
import SecondaryButton from '@/components/button/scondary-button'
import NormalNotification from '@/components/notification/normal-notification'
import Link from 'next/link'
import RuleBookModifyButton from './rule-book-modify-button'
import RuleBookParticipatesTable from './rule-book-participates-table'

const RuleBooksIdPage = async ({ params }: { params: { id: string } }) => {
  const ruleBookIdStr = params.id
  if (!ruleBookIdStr) {
    return <div>存在しないルールブックです。</div>
  }

  const ruleBookId = parseInt(ruleBookIdStr)
  const ruleBook = await fetchRuleBook(ruleBookId)
  const participates = await fetchRuleBookParticipates(ruleBookId)

  if (!ruleBook) {
    return <div>存在しないルールブックです。</div>
  }

  return (
    <div>
      <div>
        <h1>
          ルールブック: {ruleBook.name}
          <RuleBookModifyButton ruleBook={ruleBook} />
        </h1>
        <div className='mt-6'>
          <Link href={`/game-systems/${ruleBook.game_system.id}`}>
            {ruleBook.game_system.name}
          </Link>
        </div>
        <div className='mt-6'>
          <p>
            {AllRuleBookType.find((rb) => rb.value === ruleBook.type)?.label}
          </p>
        </div>
        <NormalNotification className='mt-6'>
          <p className='mb-2'>検索用ワード</p>
          {ruleBook.dictionary_names.map((word, idx) => (
            <p key={idx} className='text-xs'>
              {word}
            </p>
          ))}
        </NormalNotification>
        <div className='mt-6'>
          <h2>{ruleBook.name} の通過記録</h2>
          <RuleBookParticipatesTable participates={participates.list} />
        </div>
      </div>
      <div className='mt-8'>
        <Link href='/rule-books'>
          <SecondaryButton>ルールブック一覧</SecondaryButton>
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

export default RuleBooksIdPage

export async function generateMetadata({ params }: { params: { id: string } }) {
  const ruleBookIdStr = params.id
  let title = 'Scenario Tuker | ルールブック情報'
  if (!ruleBookIdStr) {
    return { title }
  }

  const ruleBookId = parseInt(ruleBookIdStr)
  const ruleBook = await fetchRuleBook(ruleBookId)
  if (ruleBook) {
    title += ` | ${ruleBook.name}`
  }
  return { title }
}
