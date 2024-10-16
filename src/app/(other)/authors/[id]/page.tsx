import { fetchAuthor, fetchAuthorScenarios } from '@/components/api/author-api'
import SecondaryButton from '@/components/button/scondary-button'
import Link from 'next/link'
import AuthorModifyButton from './author-modify-button'
import ScenariosTable from '@/app/(other)/scenarios/scenarios-table'

const AuthorIdPage = async ({ params }: { params: { id: string } }) => {
  const authorIdStr = params.id
  if (!authorIdStr) {
    return <div>存在しないシナリオ製作者です。</div>
  }
  const authorId = parseInt(authorIdStr)
  const author = await fetchAuthor(authorId)
  const authorScenarios = await fetchAuthorScenarios(authorId)

  let title = 'Scenario Tuker | シナリオ製作者情報'
  if (author) {
    title += ` | ${author.name}`
  }

  return (
    <div>
      <title>{title}</title>
      {author ? (
        <div>
          <h1>
            シナリオ製作者: {author.name}
            <AuthorModifyButton author={author} />
          </h1>
          <div>
            <h2>製作したシナリオ</h2>
            <ScenariosTable scenarios={authorScenarios.list} />
          </div>
        </div>
      ) : (
        <div>存在しないシナリオ製作者です。</div>
      )}
      <div className='mt-8'>
        <Link href='/authors'>
          <SecondaryButton>シナリオ製作者一覧</SecondaryButton>
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

export default AuthorIdPage
