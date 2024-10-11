'use client'

import { useState } from 'react'
import Link from 'next/link'
import useAuth from '@/components/auth/auth'
import PrimaryButton from '@/components/button/primary-button'
import SignInModal from '@/components/auth/sign-in-modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

const HeaderUserButton = () => {
  const authState = useAuth()
  // sign in modal
  const [isShowSignInModal, setIsShowSignInModal] = useState(false)
  const openSignInModal = () => setIsShowSignInModal(true)
  const toggleSignInModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsShowSignInModal(!isShowSignInModal)
    }
  }

  if (!authState.isAuthenticated) return <></>
  return (
    <>
      {authState.myself ? (
        <div className='absolute right-2 flex py-2'>
          <Link href={`/users/${authState.myself.id}`}>
            <button className='rounded-sm border border-white bg-transparent px-4 py-1 text-white hover:text-blue-500'>
              <FontAwesomeIcon icon={faUser} className='h-5' />
            </button>
          </Link>
        </div>
      ) : (
        <div className='absolute right-2 flex py-2'>
          <button
            className='rounded-sm border border-white bg-transparent px-4 py-1 text-white hover:text-blue-500'
            onClick={openSignInModal}
          >
            <FontAwesomeIcon icon={faUser} className='mr-2 h-5' />
            ログイン
          </button>
          {isShowSignInModal && <SignInModal toggleModal={toggleSignInModal} />}
        </div>
      )}
    </>
  )
}

export default HeaderUserButton
