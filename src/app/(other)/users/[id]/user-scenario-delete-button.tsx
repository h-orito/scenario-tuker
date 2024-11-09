'use client'

import { deleteScenarios } from '@/components/api/myself-api'
import DangerButton from '@/components/button/danger-button'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
  scenario: ScenarioResponse
  className?: string
  reload: () => void
}

const UserScenarioDeleteButton = (props: Props) => {
  const { scenario, className, reload } = props
  const remove = async () => {
    if (!window.confirm(`所有シナリオ「${scenario.name}」を削除しますか？`)) {
      return
    }
    await deleteScenarios(scenario.id)
    reload()
  }

  return (
    <>
      <DangerButton className={className} click={remove}>
        <FontAwesomeIcon icon={faTrash} className='h-3' />
      </DangerButton>
    </>
  )
}
export default UserScenarioDeleteButton
