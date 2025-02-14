import Authenticator from '@/components/auth/authenticator'
import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Scenario Tuker'
}

export default function NotTopPageLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <div id='portal' className='mx-auto w-full p-2 text-center sm:p-6'>
        {children}
      </div>
      <Authenticator />
      <Footer />
    </>
  )
}
