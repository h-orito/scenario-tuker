import { AllScenarioType } from '@/@types/scenario-type'
import {
  fetchScenario,
  fetchScenarioAlso,
  fetchScenarioParticipates
} from '@/components/api/scenario-api'
import SecondaryButton from '@/components/button/scondary-button'
import NormalNotification from '@/components/notification/normal-notification'
import Link from 'next/link'
import AlsoScenariosTable from './also-scenarios-table'
import ScenarioModifyButton from './scenario-modify-button'
import ScenarioParticipatesTable from './scenario-participates-table'
import ScenarioUrl from './scenario-url'

const ScenariosIdPage = async ({ params }: { params: { id: string } }) => {
  const scenarioIdStr = params.id
  if (!scenarioIdStr) {
    return <div>存在しないシナリオです。</div>
  }

  const scenarioId = parseInt(scenarioIdStr)
  const scenario = await fetchScenario(scenarioId)
  if (!scenario) {
    return <div>存在しないシナリオです。</div>
  }
  const participates = await fetchScenarioParticipates({
    scenario_id: scenarioId,
    is_twitter_following: false
  })
  const alsoScenarios = await fetchScenarioAlso(scenarioId)

  const scenarioType = AllScenarioType.find((v) => v.value === scenario.type)!

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
      <div>
        <h1>
          シナリオ: {scenario.name}
          <ScenarioModifyButton scenario={scenario} />
        </h1>
        <p>{scenarioType.label}</p>
        {scenario.game_systems && scenario.game_systems.length > 0 && (
          <p className='mt-6'>
            {scenario.game_systems.map((gameSystem, idx) => (
              <span key={idx}>
                <Link href={`/game-systems/${gameSystem.id}`}>
                  {gameSystem.name}
                </Link>
                {idx < scenario.game_systems.length - 1 && '、'}
              </span>
            ))}
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
        <NormalNotification className='mt-6 p-2'>
          <p className='mb-2'>検索用ワード</p>
          {scenario.dictionary_names.map((word, idx) => (
            <p key={idx} className='text-xs'>
              {word}
            </p>
          ))}
        </NormalNotification>
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
          <ScenarioParticipatesTable
            participates={participates.list}
            type={scenarioType}
          />
        </div>
        {alsoScenarios.list.length > 0 && (
          <div className='mt-6'>
            <h2>このシナリオを通過した人が通過しているシナリオ</h2>
            <AlsoScenariosTable scenarios={alsoScenarios.list} />
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

export async function generateMetadata({ params }: { params: { id: string } }) {
  const scenarioIdStr = params.id
  let title = 'Scenario Tuker | シナリオ情報'
  if (!scenarioIdStr) {
    return {
      title
    }
  }
  const scenarioId = parseInt(scenarioIdStr)
  const scenario = await fetchScenario(scenarioId)
  if (scenario) {
    title += ` | ${scenario.name}`
  }
  return {
    title
  }
}
