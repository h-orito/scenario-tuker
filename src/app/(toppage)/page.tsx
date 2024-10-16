import { Metadata } from 'next'
import Link from 'next/link'
import { ScenarioType } from '@/@types/scenario-type'
import PrimaryButton from '@/components/button/primary-button'
import UserInfo from '@/app/(toppage)/user-info'
import ReleaseNote from './release-note'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Scenario Tuker'
  }
}

export default function Index() {
  return (
    <div>
      <Introduction />
      <UserInfo />
      <Users />
      <MurderMystery />
      <Trpg />
      <Author />
      <ReleaseNote />
    </div>
  )
}

const Introduction = () => {
  return (
    <>
      <div className='relative hidden md:block'>
        <img className='h-dvh w-full object-cover' src='/images/top.webp' />
        <p className='title-font absolute right-5 top-[20%] text-right text-[5vw] text-white'>
          Scenario Tuker
        </p>
        <p className='absolute bottom-5 right-5 text-right text-2xl text-white'>
          Scenario Tukerは
          <br />
          マーダーミステリーや
          <br />
          TRPGで通過したシナリオを
          <br />
          管理・共有できるサービスです
        </p>
      </div>
      <div className='relative md:hidden'>
        <img className='h-dvh w-full object-cover' src='/images/top-sm.webp' />
        <p className='title-font absolute right-2.5 top-[10%] text-right text-4xl text-white'>
          Scenario Tuker
        </p>
        <p className='absolute bottom-2.5 right-2.5 text-right text-xl text-white'>
          Scenario Tukerは
          <br />
          マーダーミステリーや
          <br />
          TRPGで通過したシナリオを
          <br />
          管理・共有できるサービスです
        </p>
      </div>
      <div className='my-4 w-full p-12'>
        <h2>通過記録や所持シナリオ・ルールブックを一括管理</h2>
        <p className='text-xs'>
          通過したシナリオだけでなく、
          <br />
          持っているシナリオやルールブックを管理したり、
          <br />
          閲覧制限付きで感想も登録できます。
        </p>
        <h2 className='mt-5'>マダミス・TRPGデータベース</h2>
        <p className='text-xs'>
          シナリオやルールブック、
          <br />
          製作者のデータベースとしても利用できます。
        </p>
        <h2 className='mt-5'>ランキングやレコメンドも</h2>
        <p className='text-xs'>
          人気のシナリオや、
          <br />
          一緒によく通過されているシナリオを探せます。
        </p>
      </div>
    </>
  )
}

const Users = () => {
  return (
    <div className='my-4 w-full bg-gray-200 p-12 md:my-8'>
      <h2>ユーザー</h2>
      <div className='mt-6 md:mt-12'>
        <p className='mb-6 text-xs'>
          ユーザーを検索して通過したシナリオを閲覧することができます。
        </p>
        <Link href='/users'>
          <PrimaryButton>ユーザー検索</PrimaryButton>
        </Link>
      </div>
    </div>
  )
}

const MurderMystery = () => {
  return (
    <div className='my-4 w-full bg-gray-200 p-12 md:my-8'>
      <h2>マーダーミステリー</h2>
      <div className='mt-6 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2'>
        <div className='flex flex-col justify-end gap-4'>
          <p className='text-xs'>
            登録されているマーダーミステリーのシナリオを確認することができます。
            <br />
            シナリオ詳細では、そのシナリオの通過記録や、
            <br />
            そのシナリオを通過した人がよく通過している他のシナリオも確認できます。
          </p>
          <Link
            href={{
              pathname: '/scenarios',
              query: { type: ScenarioType.MurderMystery.value }
            }}
          >
            <PrimaryButton>マーダーミステリーシナリオ一覧</PrimaryButton>
          </Link>
        </div>
        <div className='flex flex-col justify-end gap-4'>
          <p className='text-xs'>
            よく通過されているマーダーミステリーのシナリオのランキングを確認することができます。
            <br />
            シナリオ詳細では、そのシナリオの通過記録や、
            <br />
            そのシナリオを通過した人がよく通過している他のシナリオも確認できます。
          </p>
          <Link
            href={{
              pathname: '/scenarios/trend',
              query: { type: ScenarioType.MurderMystery.value }
            }}
          >
            <PrimaryButton>人気のマーダーミステリーシナリオ</PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  )
}

const Trpg = () => {
  return (
    <div className='my-4 w-full bg-gray-200 p-12 md:my-8'>
      <h2>TRPG</h2>
      <div className='mt-6 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2'>
        <div className='flex flex-col justify-end gap-4'>
          <p className='text-xs'>
            登録されているTRPGシナリオを確認することができます。
            <br />
            シナリオ詳細では、そのシナリオの通過記録や、
            <br />
            そのシナリオを通過した人がよく通過している他のシナリオも確認できます。
          </p>
          <Link
            href={{
              pathname: 'scenarios',
              query: { type: ScenarioType.Trpg.value }
            }}
          >
            <PrimaryButton>TRPGシナリオ一覧</PrimaryButton>
          </Link>
        </div>
        <div className='flex flex-col justify-end gap-4'>
          <p className='text-xs'>
            よく通過されているTRPGのシナリオのランキングを確認することができます。
            <br />
            シナリオ詳細では、そのシナリオの通過記録や、
            <br />
            そのシナリオを通過した人がよく通過している他のシナリオも確認できます。
          </p>
          <Link
            href={{
              pathname: '/scenarios/trend',
              query: { type: ScenarioType.Trpg.value }
            }}
          >
            <PrimaryButton>人気のTRPGシナリオ</PrimaryButton>
          </Link>
        </div>
        <div className='flex flex-col justify-end gap-4'>
          <p className='text-xs'>
            登録されているルールブックを確認することができます。
            <br />
            ルールブック詳細では、そのルールブックが使用されている通過記録も確認できます。
          </p>
          <Link href='/rule-books'>
            <PrimaryButton>ルールブック一覧</PrimaryButton>
          </Link>
        </div>
        <div className='flex flex-col justify-end gap-4'>
          <p className='text-xs'>
            登録されているゲームシステムを確認することができます。
            <br />
            ゲームシステム詳細では、そのゲームシステムを利用したシナリオも確認できます。
          </p>
          <Link href='/game-systems'>
            <PrimaryButton>ゲームシステム一覧</PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  )
}

const Author = () => {
  return (
    <div className='my-4 w-full bg-gray-200 p-12 md:my-8'>
      <h2>シナリオ製作者</h2>
      <div className='mt-6 flex flex-col justify-end gap-4 md:mt-12'>
        <p className='text-xs'>
          登録されているシナリオ製作者を確認することができます。
          <br />
          シナリオ製作者詳細では、その製作者が製作したシナリオも確認できます。
        </p>
        <Link href='/authors'>
          <PrimaryButton>シナリオ製作者一覧</PrimaryButton>
        </Link>
      </div>
    </div>
  )
}
