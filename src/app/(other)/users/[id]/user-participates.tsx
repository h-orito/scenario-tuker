'use client'

import { ScenarioType } from '@/@types/scenario-type'
import { useEffect, useState } from 'react'
import UserParticipatesTable from './user-participates-table'
import UserRuleBooksTable from './user-rule-books-table'
import UserScenariosTable from './user-scenarios-table'

type Props = {
  user: User
  participates: Array<ParticipateResponse>
  scenarios: Array<ScenarioResponse>
  ruleBooks: Array<RuleBookResponse>
}

const UserParticipates = ({
  user,
  participates,
  scenarios,
  ruleBooks
}: Props) => {
  // tab
  const [tab, setTab] = useState<ScenarioType>(ScenarioType.MurderMystery)
  // participates
  const [murderMysteryParticipates, setMurderMysteryParticipates] = useState<
    Array<ParticipateResponse>
  >([])
  const [trpgParticipates, setTrpgParticipates] = useState<
    Array<ParticipateResponse>
  >([])
  // scenarios
  const [murderMysteryScenarios, setMurderMysteryScenarios] = useState<
    Array<ScenarioResponse>
  >([])
  const [trpgScenarios, setTrpgScenarios] = useState<Array<ScenarioResponse>>(
    []
  )
  // ruleBooks
  const [trpgRuleBooks, setTrpgRuleBooks] = useState<Array<RuleBookResponse>>(
    []
  )

  useEffect(() => {
    // participates
    const murderMysteryParticipates = participates.filter(
      (p) => p.scenario.type === ScenarioType.MurderMystery.value
    )
    setMurderMysteryParticipates(murderMysteryParticipates)
    const trpgParticipates = participates.filter(
      (p) => p.scenario.type === ScenarioType.Trpg.value
    )
    setTrpgParticipates(trpgParticipates)
    // scenarios
    const murderMysteryScenarios = scenarios.filter(
      (s) => s.type === ScenarioType.MurderMystery.value
    )
    setMurderMysteryScenarios(murderMysteryScenarios)
    const trpgScenarios = scenarios.filter(
      (s) => s.type === ScenarioType.Trpg.value
    )
    setTrpgScenarios(trpgScenarios)
    // ruleBooks
    setTrpgRuleBooks(ruleBooks)
    // 数が多い方を初期表示する
    setTab(
      murderMysteryParticipates.length + murderMysteryScenarios.length <
        trpgParticipates.length + trpgScenarios.length + ruleBooks.length
        ? ScenarioType.Trpg
        : ScenarioType.MurderMystery
    )
  }, [user, participates, scenarios, ruleBooks])

  return (
    <div>
      <div className='flex'>
        <TabButton tab={tab} setTab={setTab} type={ScenarioType.MurderMystery}>
          マーダーミステリー
        </TabButton>
        <TabButton tab={tab} setTab={setTab} type={ScenarioType.Trpg}>
          TRPG
        </TabButton>
      </div>
      {tab === ScenarioType.MurderMystery ? (
        <div className='w-full'>
          <h2>{ScenarioType.MurderMystery.label}通過記録</h2>
          <div className='mb-6'>
            <UserParticipatesTable
              participates={murderMysteryParticipates}
              type={ScenarioType.MurderMystery}
            />
          </div>
          <h2>所有シナリオ</h2>
          <UserScenariosTable
            scenarios={murderMysteryScenarios}
            type={ScenarioType.MurderMystery}
          />
        </div>
      ) : (
        <div className='w-full'>
          <h2>{ScenarioType.Trpg.label}通過記録</h2>
          <div className='mb-6'>
            <UserParticipatesTable
              participates={trpgParticipates}
              type={ScenarioType.Trpg}
            />
          </div>
          <h2>所有シナリオ</h2>
          <UserScenariosTable
            scenarios={trpgScenarios}
            type={ScenarioType.Trpg}
          />
          <h2>所有ルールブック</h2>
          <UserRuleBooksTable ruleBooks={trpgRuleBooks} />
        </div>
      )}
    </div>
  )
}

export default UserParticipates

type TabButtonProps = {
  tab: ScenarioType
  setTab: (type: ScenarioType) => void
  type: ScenarioType
  children: React.ReactNode
}

const TabButton = ({ tab, setTab, type, children }: TabButtonProps) => {
  const activeTabButtonClass = 'border-b border-blue-500 text-blue-500'
  const notActiveTabButtonClass = 'border-b border-gray-300 text-gray-500'
  return (
    <button
      className={`flex-1 p-2 font-bold text-md ${tab === type ? activeTabButtonClass : notActiveTabButtonClass}`}
      onClick={() => setTab(type)}
    >
      {children}
    </button>
  )
}
