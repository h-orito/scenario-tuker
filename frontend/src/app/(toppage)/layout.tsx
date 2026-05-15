import type { Metadata } from 'next'
import '../globals.css'
import Footer from '@/components/layout/footer'
import Authenticator from '@/components/auth/authenticator'

export const metadata: Metadata = {
  title: 'Scenario Tuker'
}

export default function TopPageLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div id='portal' className='w-full text-center'>
        {children}
      </div>
      <Authenticator />
      <Footer />
    </>
  )
}
