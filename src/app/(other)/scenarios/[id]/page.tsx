import {
  fetchScenario,
  fetchScenarioAlso,
  fetchScenarioParticipates
} from '@/components/api/scenario-api'
import ScenarioModifyButton from './scenario-modify-button'
import { AllScenarioType } from '@/@types/scenario-type'
import Link from 'next/link'
import SecondaryButton from '@/components/button/scondary-button'
import ScenarioUrl from './scenario-url'

const ScenariosIdPage = async ({ params }: { params: { id: string } }) => {
  const scenarioIdStr = params.id
  if (!scenarioIdStr) {
    return <div>存在しないシナリオです。</div>
  }

  const scenarioId = parseInt(scenarioIdStr)
  const scenario = await fetchScenario(scenarioId)
  const participates = await fetchScenarioParticipates({
    scenario_id: scenarioId,
    is_twitter_following: false
  })
  const alsoScenarios = await fetchScenarioAlso(scenarioId)

  let title = 'Scenario Tuker | シナリオ情報'
  if (scenario) {
    title += ` | ${scenario.name}`
  }

  const scenarioType = AllScenarioType.find(
    (v) => v.value === scenario?.type
  )!.label

  let playerNum = ''
  if (scenario.player_num_min && scenario.player_num_max) {
    if (scenario.player_num_min === scenario.player_num_max) {
      playerNum = `${scenario.player_num_min}人`
    } else {
      playerNum = `${scenario.player_num_min}～${scenario.player_num_max}人`
    }
  } else if (scenario.player_num_min) {
    playerNum = `${scenario.player_num_min}人～`
  } else if (scenario.player_num_max) {
    playerNum = `～${scenario.player_num_max}人`
  }

  return (
    <div>
      <title>{title}</title>
      <div>
        <h1>
          シナリオ: {scenario.name}
          <ScenarioModifyButton scenario={scenario} />
        </h1>
        <p>{scenarioType}</p>
        {scenario.game_system && (
          <p className='mt-6'>
            <Link href={`/game-systems/${scenario.game_system.id}`}>
              {scenario.game_system.name}
            </Link>
          </p>
        )}
        <ScenarioUrl scenario={scenario} />
        {scenario.authors.length > 0 && (
          <div className='mt-6'>
            {scenario.authors.map((author, idx) => (
              <span key={idx}>
                <Link href={`/authors/${author.id}`}>{author.name}</Link>
                {idx < scenario.authors.length - 1 && '、'}
              </span>
            ))}
          </div>
        )}
        <div className='mt-6 rounded bg-gray-300 p-2'>
          <p className='mb-2'>検索用ワード</p>
          {scenario.dictionary_names.map((word, idx) => (
            <p key={idx} className='text-xs'>
              {word}
            </p>
          ))}
        </div>
        {playerNum !== '' && (
          <div className='mt-6'>
            <p>PL人数:&nbsp;{playerNum}</p>
          </div>
        )}
        {scenario.required_hours && (
          <div className='mt-6'>
            <p>プレイ時間目安:&nbsp;{scenario.required_hours}時間</p>
          </div>
        )}
        <div className='mt-6'>
          <h2>{scenario.name} の通過記録</h2>
          {/* <ParticipateTable/> */}
        </div>
        {alsoScenarios.list.length > 0 && (
          <div className='mt-6'>
            <h2>このシナリオを通過した人が通過しているシナリオ</h2>
            {/* <ScenariosTable scenarios={alsoScenarios.list} /> */}
          </div>
        )}
      </div>
      <div className='mt-8'>
        <Link href='/scenarios'>
          <SecondaryButton>シナリオ一覧</SecondaryButton>
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

export default ScenariosIdPage
