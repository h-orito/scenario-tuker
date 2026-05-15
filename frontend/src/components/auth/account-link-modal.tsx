import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PrimaryButton from '../button/primary-button'
import {
  linkWithGoogle,
  linkWithTwitter,
  hasGoogleLinked,
  hasTwitterLinked
} from '../lib/firebase/firebase-auth'
import Modal from '../modal/modal'
import { faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { useAuth } from '@/components/auth/use-auth'

type Props = {
  toggleModal: (e: any) => void
}
const AccountLinkModal = ({ toggleModal }: Props) => {
  const authState = useAuth()
  if (!authState.isAuthenticated) return <></>

  const isAlreadyTwitterLinked = hasTwitterLinked(authState)
  const isAlreadyGoogleLinked = hasGoogleLinked(authState)

  const linkTwitter = async () => {
    await linkWithTwitter()
    location.reload()
  }

  const linkGoogle = async () => {
    await linkWithGoogle()
    location.reload()
  }

  return (
    <Modal header='ログイン' close={toggleModal}>
      <>
        <div className='my-4 leading-5'>
          <p>
            追加でログインすると、現在ログインしているアカウントに紐付けることができます。
            <br />
            例えば、Twitter連携＋Google連携にしておくと、Twitter連携できなくなった場合も
            <br />
            Google連携でログインすることができます。
          </p>
          <p className='mt-4 text-red-500'>
            なお、他でログインしたことがあるアカウントは、現在ログインしているアカウントに紐づけることができません。
          </p>
        </div>
        <div className='my-3'>
          <hr className='mb-3' />
          <PrimaryButton disabled={isAlreadyTwitterLinked} click={linkTwitter}>
            <FontAwesomeIcon icon={faTwitter} className='mr-2' />
            Twitterログイン
          </PrimaryButton>
          {isAlreadyTwitterLinked ? (
            <p>既に連携済みです。</p>
          ) : (
            <p>
              TwitterのIDで他の方からあなたを検索することができるようになります。
            </p>
          )}
        </div>
        <div className='my-3'>
          <hr className='mb-3' />
          <PrimaryButton disabled={isAlreadyGoogleLinked} click={linkGoogle}>
            <FontAwesomeIcon icon={faGoogle} className='mr-2' />
            Googleログイン
          </PrimaryButton>
          {isAlreadyGoogleLinked ? (
            <p>既に連携済みです。</p>
          ) : (
            <p>メールアドレスが表示されることはありません。</p>
          )}
        </div>
      </>
    </Modal>
  )
}
export default AccountLinkModal
