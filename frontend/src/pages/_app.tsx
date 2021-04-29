import React from 'react'
import Head from 'next/head'

import '@/styles/global.scss'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from '@/contexts/auth'
import { MusicProvider } from '@/contexts/music'
import { AppHeader } from '@/components/AppHeader'
import { AppFooter } from '@/components/AppFooter'
import Firebase, { FirebaseContext } from '@/libs/firebase'

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ChakraProvider>
        <FirebaseContext.Provider value={Firebase.instance}>
          <MusicProvider>
            <AuthProvider>
              <AppHeader />
              <div style={{ paddingTop: 66 }}>
                <Component {...pageProps} />
              </div>
              <AppFooter />
            </AuthProvider>
          </MusicProvider>
        </FirebaseContext.Provider>
      </ChakraProvider>
    </>
  )
}

export default App
