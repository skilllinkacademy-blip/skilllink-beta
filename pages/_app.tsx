import type { AppProps } from 'next/app'
import '../styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>SkillLink | Connect with Trade Professionals</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
