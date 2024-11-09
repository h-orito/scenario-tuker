'use client'

import { deleteParticipates } from '@/components/api/myself-api'
import DangerButton from '@/components/button/danger-button'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
  participate: ParticipateResponse
  className?: string
  reload: () => void
}

const ParticipateDeleteButton = (props: Props) => {
  const { participate, className, reload } = props
  const removeParticipate = async () => {
    if (
      !window.confirm(
        `シナリオ「${participate.scenario.name}」の参加記録を削除しますか？`
      )
    ) {
      return
    }
    await deleteParticipates(participate.id)
    reload()
  }

  return (
    <>
      <DangerButton className={className} click={removeParticipate}>
        <FontAwesomeIcon icon={faTrash} className='h-3' />
      </DangerButton>
    </>
  )
}
export default ParticipateDeleteButton
