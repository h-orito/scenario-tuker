import { faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PrimaryButton from '../button/primary-button'
import {
  signInWithGoogle,
  signInWithTwitter
} from '../lib/firebase/firebase-auth'
import Modal from '../modal/modal'

type Props = {
  toggleModal: (e: any) => void
}
const SignInModal = ({ toggleModal }: Props) => {
  return (
    <Modal header='ログイン' close={toggleModal}>
      <>
        <p className='mt-2'>
          いずれかのアカウントと連携してログインしてください。
          <br />
        </p>
        <p className='mb-2 text-red-500'>
          既存のアカウントに別のログイン方法を紐付けたい場合は、まず既存のアカウントでログインしてください。
          <br />
          ログインしたことがあるアカウントは後から追加で紐付けることができないので、ご注意ください。
        </p>
        <div className='my-3'>
          <hr className='mb-3' />
          <PrimaryButton click={signInWithTwitter}>
            <FontAwesomeIcon icon={faTwitter} className='mr-2' />
            Twitterログイン
          </PrimaryButton>
          <p>
            ユーザー名およびTwitterのIDで他の方からあなたを検索することができます。
            <br />
            名前はログイン後にマイページで変更することができます。
          </p>
        </div>
        <div className='my-3'>
          <hr className='mb-3' />
          <PrimaryButton click={signInWithGoogle}>
            <FontAwesomeIcon icon={faGoogle} className='mr-2' />
            Googleログイン
          </PrimaryButton>
          <p>
            ユーザー名で他の方からあなたを検索することができます。
            <br />
            ユーザー名はログイン後にマイページで変更することができます。
            <br />
            メールアドレスが表示されることはありません。
          </p>
        </div>
      </>
    </Modal>
  )
}
export default SignInModal
