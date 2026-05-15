import { Provider } from 'jotai'
import type { Metadata } from 'next'
import React from 'react'
import './globals.css'

const siteName = 'Scenario Tuker'
const baseUrl = 'https://scenario-tuker.netlify.app/'
const description =
  'マーダーミステリーやTRPGで通過したシナリオを管理・共有できるサービスです'

export const metadata: Metadata = {
  title: siteName,
  description: description,
  keywords:
    'シナリオ,ツーカー,シナリオツーカー,マーダーミステリー,TRPG,Scenario,MurderMystery,テーブルトークロールプレイングゲーム,マダミス',
  openGraph: {
    siteName: siteName,
    type: 'website',
    url: baseUrl,
    title: siteName,
    description: description,
    images: [
      {
        url: `${baseUrl}images/top.webp`,
        alt: siteName
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ort_dev'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <head>
        <script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0917187897820609'
          crossOrigin='anonymous'
        ></script>

        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Sarpanch:wght@400;500;600;700;800;900&display=swap'
          rel='stylesheet'
        />
      </head>
      <body className='text-xs sm:text-sm'>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
