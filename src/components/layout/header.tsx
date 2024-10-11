import Link from 'next/link'
import HeaderUserButton from './header-user-button'

const Header = () => {
  return (
    <div className='flex w-full justify-center bg-slate-800'>
      <div className='px-2 py-2'>
        <Link href='/' className='title-font'>
          Scenario Tuker
        </Link>
      </div>
      <HeaderUserButton />
    </div>
  )
}

export default Header
