'use client'

import { useAuth } from '@/components/auth/use-auth'
import PrimaryButton from '@/components/button/primary-button'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import CreateAuthorModal from '../authors/create-author'

type Props = {
  postSave: (author: Author) => void
}

const AuthorCreateButton = ({ postSave }: Props) => {
  const [isShowModel, setIsShowModel] = useState(false)
  const openModal = (e: any) => {
    e.preventDefault()
    setIsShowModel(true)
  }
  const toggleModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsShowModel(!isShowModel)
    }
  }

  const handlePostSave = (author: Author) => {
    postSave(author)
    setIsShowModel(false)
  }

  const auth = useAuth()

  if (!auth.isSignedIn) {
    return <></>
  }

  return (
    <>
      <PrimaryButton className='ml-1 py-0' click={openModal}>
        <FontAwesomeIcon icon={faPlus} className='mr-1' />
        新規
      </PrimaryButton>
      {isShowModel && (
        <CreateAuthorModal
          toggleModal={toggleModal}
          postSave={handlePostSave}
        />
      )}
    </>
  )
}
export default AuthorCreateButton
