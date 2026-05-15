'use client'

import { ScenarioType } from '@/@types/scenario-type'
import { useAuth } from '@/components/auth/use-auth'
import { useEffect, useMemo, useState } from 'react'
import ParticipateCreateButton from './participate-create-button'
import ParticipateSortButton from './participate-sort-button'
import ParticipatesCreateButton from './participates-create-button'
import ParticipatesModifyButton from './participates-modify-button'
import UserParticipatesTable from './user-participates-table'
import UserRuleBookAddButton from './user-rule-book-add-button'
import UserRuleBooksTable from './user-rule-books-table'
import UserScenarioAddButton from './user-scenario-add-button'
import UserScenariosTable from './user-scenarios-table'

type Props = {
  user: User
  participates: Array<ParticipateResponse>
  scenarios: Array<ScenarioResponse>
  ruleBooks: Array<RuleBookResponse>
  reloadParticipates: () => void
  reloadScenarios: () => void
  reloadRuleBooks: () => void
}

const UserParticipates = ({
  user,
  participates,
  scenarios,
  ruleBooks,
  reloadParticipates,
  reloadScenarios,
  reloadRuleBooks
}: Props) => {
  // tab
  const [tab, setTab] = useState<ScenarioType>(ScenarioType.MurderMystery)
  // participates
  const mdParticipates = useMemo(() => {
    return participates.filter(
      (p) => p.scenario.type === ScenarioType.MurderMystery.value
    )
  }, [participates])
  const trParticipates = useMemo(() => {
    return participates.filter(
      (p) => p.scenario.type === ScenarioType.Trpg.value
    )
  }, [participates])

  // scenarios
  const mdScenarios = useMemo(() => {
    return scenarios.filter((s) => s.type === ScenarioType.MurderMystery.value)
  }, [scenarios])
  const trScenarios = useMemo(() => {
    return scenarios.filter((s) => s.type === ScenarioType.Trpg.value)
  }, [scenarios])

  useEffect(() => {
    // 数が多い方を初期表示する
    setTab(
      mdParticipates.length + mdScenarios.length <
        trParticipates.length + trScenarios.length + ruleBooks.length
        ? ScenarioType.Trpg
        : ScenarioType.MurderMystery
    )
  }, [user.id])

  const isMyPage = useAuth().myself?.id === user.id

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
          {isMyPage && (
            <div className='my-2 flex justify-center gap-2'>
              <ParticipateCreateButton
                className='text-xs py-1'
                scenarioType={ScenarioType.MurderMystery}
                reload={reloadParticipates}
              />
              <ParticipatesCreateButton
                className='text-xs py-1'
                scenarioType={ScenarioType.MurderMystery}
                reload={reloadParticipates}
              />
              <ParticipateSortButton
                participates={mdParticipates}
                className='text-xs py-1'
                scenarioType={ScenarioType.MurderMystery}
                reload={reloadParticipates}
              />
              <ParticipatesModifyButton
                className='text-xs py-1'
                participates={mdParticipates}
                reload={reloadParticipates}
                scenarioType={ScenarioType.MurderMystery}
              />
            </div>
          )}
          <div className='mb-6'>
            <UserParticipatesTable
              canModify={isMyPage}
              participates={mdParticipates}
              type={ScenarioType.MurderMystery}
              reload={reloadParticipates}
            />
          </div>
          <h2>所有シナリオ</h2>
          {isMyPage && (
            <div className='my-2 flex gap-2 justify-center'>
              <UserScenarioAddButton
                className='text-xs py-1'
                scenarios={mdScenarios}
                scenarioType={ScenarioType.MurderMystery}
                reload={reloadScenarios}
              />
            </div>
          )}
          <UserScenariosTable
            canModify={isMyPage}
            scenarios={mdScenarios}
            type={ScenarioType.MurderMystery}
            reload={reloadScenarios}
          />
        </div>
      ) : (
        <div className='w-full'>
          <h2>{ScenarioType.Trpg.label}通過記録</h2>
          <div className='mb-6'>
            {isMyPage && (
              <div className='my-2 flex gap-2 justify-center'>
                <ParticipateCreateButton
                  className='text-xs py-1'
                  scenarioType={ScenarioType.Trpg}
                  reload={reloadParticipates}
                />
                <ParticipatesCreateButton
                  className='text-xs py-1'
                  scenarioType={ScenarioType.Trpg}
                  reload={reloadParticipates}
                />
                <ParticipateSortButton
                  participates={trParticipates}
                  className='text-xs py-1'
                  scenarioType={ScenarioType.Trpg}
                  reload={reloadParticipates}
                />
                <ParticipatesModifyButton
                  className='text-xs py-1'
                  participates={trParticipates}
                  reload={reloadParticipates}
                  scenarioType={ScenarioType.Trpg}
                />
              </div>
            )}
            <UserParticipatesTable
              canModify={isMyPage}
              participates={trParticipates}
              type={ScenarioType.Trpg}
              reload={reloadParticipates}
            />
          </div>
          <h2>所有シナリオ</h2>
          <div className='mb-6'>
            {isMyPage && (
              <div className='my-2 flex gap-2 justify-center'>
                <UserScenarioAddButton
                  className='text-xs py-1'
                  scenarios={mdScenarios}
                  scenarioType={ScenarioType.Trpg}
                  reload={reloadScenarios}
                />
              </div>
            )}
            <UserScenariosTable
              canModify={isMyPage}
              scenarios={trScenarios}
              type={ScenarioType.Trpg}
              reload={reloadScenarios}
            />
          </div>
          <h2>所有ルールブック</h2>
          <div>
            {isMyPage && (
              <div className='my-2 flex gap-2 justify-center'>
                <UserRuleBookAddButton
                  className='text-xs py-1'
                  ruleBooks={ruleBooks}
                  reload={reloadRuleBooks}
                />
              </div>
            )}
            <UserRuleBooksTable
              canModify={isMyPage}
              ruleBooks={ruleBooks}
              reload={reloadRuleBooks}
            />
          </div>
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
