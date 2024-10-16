'use client'

import Link from 'next/link'
import { useState } from 'react'
import AccountLinkModal from '@/components/auth/account-link-modal'
import { useAuth } from '@/components/auth/use-auth'
import SignInModal from '@/components/auth/sign-in-modal'
import DangerButton from '@/components/button/danger-button'
import PrimaryButton from '@/components/button/primary-button'
import { signOut } from '@/components/lib/firebase/firebase-auth'

const UserInfo = () => {
  const authState = useAuth()
  const [isShowAccountLinkModal, setIsShowAccountLinkModal] = useState(false)
  const [isShowSignInModal, setIsShowSignInModal] = useState(false)

  const openAccountLinkModal = () => setIsShowAccountLinkModal(true)
  const toggleAccountLinkModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsShowAccountLinkModal(!isShowAccountLinkModal)
    }
  }
  const openSignInModal = () => setIsShowSignInModal(true)
  const toggleSignInModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsShowSignInModal(!isShowSignInModal)
    }
  }

  const logOut = () => signOut()

  if (!authState.isAuthenticated) return <></>

  return (
    <>
      <div className='my-4 w-full bg-gray-200 p-12 md:mb-8'>
        <h2>ログイン</h2>
        {authState.myself ? (
          <div className='grid'>
            <div className='col-12 mb-6 md:mb-12'>
              ようこそ
              <strong className='text-lg'>{authState.myself.name}</strong> さん
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex flex-col justify-end gap-4'>
                <p className='text-xs'>
                  名前を変更したり、通過シナリオを管理したり、
                  <br />
                  通過した感想を登録することができます。
                </p>
                <Link href={`/users/${authState.myself.id}`}>
                  <PrimaryButton>マイページ</PrimaryButton>
                </Link>
              </div>
              <div className='flex flex-col justify-end gap-4'>
                <div>
                  <PrimaryButton click={openAccountLinkModal}>
                    他SNSアカウント連携
                  </PrimaryButton>
                  {isShowAccountLinkModal && (
                    <AccountLinkModal toggleModal={toggleAccountLinkModal} />
                  )}
                </div>
                <div>
                  <DangerButton click={logOut}>ログアウト</DangerButton>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className='mb-4 text-xs'>
              ログインするとあなたが通過したシナリオを管理したり、
              <br />
              閲覧制限付きの感想を参照することができます。
            </p>
            <PrimaryButton click={openSignInModal}>ログイン</PrimaryButton>
            {isShowSignInModal && (
              <SignInModal toggleModal={toggleSignInModal} />
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default UserInfo
