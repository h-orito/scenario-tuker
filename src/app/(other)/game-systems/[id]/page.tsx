import {
  fetchGameSystem,
  fetchGameSystemScenarios
} from '@/components/api/game-system-api'
import SecondaryButton from '@/components/button/scondary-button'
import NormalNotification from '@/components/notification/normal-notification'
import Link from 'next/link'
import GameSystemModifyButton from './game-system-modify-button'
import GameSystemScenariosTable from './game-system-scenarios-table'

const GameSystemsIdPage = async ({ params }: { params: { id: string } }) => {
  const gameSystemIdStr = params.id
  if (!gameSystemIdStr) {
    return <div>存在しないシナリオです。</div>
  }

  const gameSystemId = parseInt(gameSystemIdStr)
  const gameSystem = await fetchGameSystem(gameSystemId)
  const scenarios = await fetchGameSystemScenarios(gameSystemId)

  let title = 'GameSystem Tuker | ゲームシステム情報'
  if (gameSystem) {
    title += ` | ${gameSystem.name}`
  }

  return (
    <div>
      <title>{title}</title>
      <div>
        <h1>
          ゲームシステム: {gameSystem.name}
          <GameSystemModifyButton gameSystem={gameSystem} />
        </h1>
        <NormalNotification className='mt-6'>
          <p className='mb-2'>検索用ワード</p>
          {gameSystem.dictionary_names.map((word, idx) => (
            <p key={idx} className='text-xs'>
              {word}
            </p>
          ))}
        </NormalNotification>
        <div className='mt-6'>
          <h2>{gameSystem.name} のシナリオ</h2>
          <GameSystemScenariosTable scenarios={scenarios.list} />
        </div>
      </div>
      <div className='mt-8'>
        <Link href='/game-systems'>
          <SecondaryButton>ゲームシステム一覧</SecondaryButton>
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

export default GameSystemsIdPage
