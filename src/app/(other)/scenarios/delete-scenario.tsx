'use client'

import { ScenarioType } from '@/@types/scenario-type'
import {
  deleteScenario,
  deleteScenarioCheck,
  integrateDeleteScenario
} from '@/components/api/scenario-api'
import DangerButton from '@/components/button/danger-button'
import FormLabel from '@/components/form/form-label'
import Modal from '@/components/modal/modal'
import ScenarioSelect from '@/components/pages/scenarios/scenario-select'
import { useCallback, useState } from 'react'

const DeleteScenarioModal = ({
  scenario,
  toggleModal,
  postDelete
}: {
  scenario: ScenarioResponse
  toggleModal: (e: any) => void
  postDelete: () => void
}) => {
  return (
    <Modal close={toggleModal}>
      <>
        <h2>シナリオ削除</h2>
        <p className='my-6'>
          シナリオ
          <strong>{scenario.name}</strong> を削除しますか？
        </p>
        <RemoveScenarioArea scenario={scenario} postDelete={postDelete} />
        <IntegrateScenarioArea scenario={scenario} postDelete={postDelete} />
      </>
    </Modal>
  )
}
export default DeleteScenarioModal

type RemoveScenarioAreaProps = {
  scenario: ScenarioResponse
  postDelete: () => void
}

const RemoveScenarioArea = ({
  scenario,
  postDelete
}: RemoveScenarioAreaProps) => {
  const [errorMessage, setErrorMesssage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const del = async (): Promise<void> => {
    if (!window.confirm('削除してもよろしいですか？')) {
      return
    }
    setSubmitting(true)
    const check = await deleteScenarioCheck(scenario.id)
    if (!check.ok) {
      setErrorMesssage(check.message || null)
      setSubmitting(false)
      return
    }
    await deleteScenario(scenario.id)
    setSubmitting(false)
    postDelete()
  }

  return (
    <div className='bg-gray-200 my-6 p-4'>
      <h2>削除</h2>
      <p className='my-4'>
        通過記録やユーザー所有シナリオと紐付いていない場合のみ削除できます。
      </p>
      <div>
        <DangerButton click={del} disabled={submitting || errorMessage != null}>
          削除
        </DangerButton>
        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
      </div>
    </div>
  )
}

const IntegrateScenarioArea = ({
  scenario,
  postDelete
}: {
  scenario: ScenarioResponse
  postDelete: () => void
}) => {
  const [destScenario, setDestScenario] = useState<ScenarioResponse | null>(
    null
  )
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMesssage] = useState<string | null>(null)
  const integrate = useCallback(async () => {
    if (
      !window.confirm(`${destScenario!.name}に統合してもしてもよろしいですか？`)
    ) {
      return
    }
    try {
      setSubmitting(true)
      await integrateDeleteScenario(scenario.id, destScenario!.id)
      setSubmitting(false)
      postDelete()
    } catch (e) {
      setErrorMesssage('統合に失敗しました')
    }
  }, [scenario, destScenario])

  return (
    <div className='bg-gray-200 my-6 p-4'>
      <h2>別シナリオに統合</h2>
      <p className='my-4'>
        TRPGの場合、ゲームシステムが全て同じシナリオにのみ統合できます。
      </p>
      <p className='my-4'>
        このシナリオを削除し、以下の内容を、指定したシナリオに付け替えます。
        <div className='flex justify-center'>
          <ul className='mt-4 list-disc text-left'>
            <li>検索用キーワード</li>
            <li>このシナリオの通過記録</li>
            <li>ユーザー所有シナリオ</li>
          </ul>
        </div>
      </p>
      <div className='my-4'>
        <FormLabel label='統合先シナリオ' />
        <ScenarioSelect
          gameSystemIds={scenario.game_systems.map((gs) => gs.id)}
          scenarioType={
            scenario.type === ScenarioType.MurderMystery.value
              ? ScenarioType.MurderMystery
              : ScenarioType.Trpg
          }
          selected={destScenario}
          setSelected={setDestScenario}
        />
      </div>
      <div>
        <DangerButton
          click={integrate}
          disabled={submitting || errorMessage != null}
        >
          削除して統合
        </DangerButton>
      </div>
    </div>
  )
}
