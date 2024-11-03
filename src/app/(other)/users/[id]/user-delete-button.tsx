'use client'

import { deleteMyself } from '@/components/api/myself-api'
import DangerButton from '@/components/button/danger-button'

const DeleteButton = () => {
  const confirmToDelete = async () => {
    if (confirm('ユーザーを削除しますか？この操作は取り消せません。')) {
      await deleteMyself()
      location.reload()
    }
  }

  return <DangerButton click={confirmToDelete}>ユーザー削除</DangerButton>
}

export default DeleteButton
