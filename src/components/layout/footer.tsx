'use client'

import { useState } from 'react'
import Link from 'next/link'
import PrimaryButton from '../button/primary-button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faDollar } from '@fortawesome/free-solid-svg-icons'
import Modal from '../modal/modal'

const Footer = () => {
  const [isShowDonateModal, setIsShowDonateModal] = useState(false)
  const openDonateModal = () => setIsShowDonateModal(true)
  const toggleDonateModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsShowDonateModal(!isShowDonateModal)
    }
  }

  return (
    <footer className='w-full border-t border-gray-300 p-2'>
      <div className='flex justify-center gap-2'>
        <Link
          href='https://twitter.com/ort_dev'
          target='_blank'
          rel='noreferrer'
        >
          <FooterButton>
            <FontAwesomeIcon icon={faTwitter} />
          </FooterButton>
        </Link>
        <FooterButton click={openDonateModal}>
          <FontAwesomeIcon icon={faDollar} />
        </FooterButton>
        <Link
          href='https://github.com/h-orito/scenario-tuker'
          target='_blank'
          rel='noreferrer'
        >
          <FooterButton>
            <FontAwesomeIcon icon={faGithub} />
          </FooterButton>
        </Link>
      </div>
      <div className='mt-2 flex justify-center text-xs'>© 2022- ort</div>
      {isShowDonateModal && (
        <Modal header='投げ銭について' close={toggleDonateModal}>
          <Donate />
        </Modal>
      )}
    </footer>
  )
}

const FooterButton = ({
  children,
  click
}: {
  children: React.ReactNode
  click?: () => void
}) => {
  return (
    <button
      className='rounded-full border bg-blue-500 px-4 py-1 text-white hover:bg-blue-600 disabled:bg-blue-200'
      onClick={click}
    >
      {children}
    </button>
  )
}

const Donate = () => {
  return (
    <div>
      <p className='mb-2 mt-5 text-lg'>Amazonほしい物リストから送る</p>
      <ul>
        <li>Amazonほしいものリストから選んで開発者に送ることができます。</li>
      </ul>
      <PrimaryButton
        className='my-2'
        click={() =>
          window.open(
            'https://www.amazon.jp/hz/wishlist/ls/1KZSJAJS1ETW4?ref_=wl_share'
          )
        }
      >
        Amazonほしいものリストを開く
      </PrimaryButton>
      <p className='mb-2 mt-5 text-lg'>Amazonギフト券（Eメールタイプ）を送る</p>
      <ul>
        <li>
          受取人に「wolfortあっとgooglegroups.com」を指定してください（あっとのところは@に変えてください）。
        </li>
        <li>金額は15円以上で自由に変更できます。</li>
      </ul>
      <PrimaryButton
        className='my-2'
        click={() => window.open('https://www.amazon.co.jp/dp/B004N3APGO')}
      >
        Amazonギフト券を送る
      </PrimaryButton>
      <p className='mb-2 mt-5 text-lg'>Amazonアソシエイト経由で買い物をする</p>
      <ul>
        <li>
          下記からAmazonに遷移してカートに追加＆購入すると、開発者に若干の紹介料が入ります。
        </li>
      </ul>
      <PrimaryButton
        className='my-2'
        click={() =>
          window.open(
            'https://www.amazon.co.jp/b?_encoding=UTF8&tag=wolfort0d-22&linkCode=ur2&linkId=faf82136a01cf462858661dc52891566&camp=247&creative=1211&node=71314051'
          )
        }
      >
        Amazonを開く
      </PrimaryButton>
    </div>
  )
}

export default Footer
