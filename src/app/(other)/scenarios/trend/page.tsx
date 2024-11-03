import { AllScenarioType, ScenarioType } from '@/@types/scenario-type'
import { fetchPopularScenarios } from '@/components/api/scenario-api'
import SecondaryButton from '@/components/button/scondary-button'
import Link from 'next/link'
import TrendScenariosTable from './trend-scenarios-table'

const ScenarioTrendsPage = async ({
  searchParams
}: {
  searchParams: { type: string }
}) => {
  const scenarioTypeStr = searchParams.type
  console.log(scenarioTypeStr)
  const scenarioType =
    AllScenarioType.find((v) => v.value === scenarioTypeStr) ??
    ScenarioType.Trpg
  const scenarioTypeName =
    scenarioType === ScenarioType.Trpg ? 'TRPG' : 'マーダーミステリー'
  const scenarios = await fetchPopularScenarios(scenarioType.value)

  return (
    <div>
      <h1>人気の{scenarioTypeName}シナリオ</h1>
      <TrendScenariosTable scenarios={scenarios.list} type={scenarioType} />
      <div className='mt-4'>
        <Link href='/'>
          <SecondaryButton>トップページ</SecondaryButton>
        </Link>
      </div>
    </div>
  )
}

export default ScenarioTrendsPage

export async function generateMetadata({
  searchParams
}: {
  searchParams: { type: string }
}) {
  const scenarioTypeStr = searchParams.type
  const scenarioType =
    AllScenarioType.find((v) => v.value === scenarioTypeStr) ??
    ScenarioType.Trpg
  const scenarioTypeName =
    scenarioType === ScenarioType.Trpg ? 'TRPG' : 'マーダーミステリー'
  return {
    title: `Scenario Tuker | 人気の${scenarioTypeName}シナリオ`
  }
}
