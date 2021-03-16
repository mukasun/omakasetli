import React from 'react'
import Head from 'next/head'

import '@/styles/global.scss'
import { config } from '@@/site.config'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from '@/contexts/auth'
import { MusicProvider } from '@/contexts/music'
import { AppHeader } from '@/components/AppHeader'
import { AppFooter } from '@/components/AppFooter'
import { store, persistor } from '@/store'
import { Spinner } from '@chakra-ui/react'
import Firebase, { FirebaseContext } from '@/libs/firebase'

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link rel="icon shortcut" type="image/png" href={`${config.siteRoot}/logo.png`} />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ChakraProvider>
        <Provider store={store}>
          <PersistGate loading={<Spinner />} persistor={persistor}>
            <FirebaseContext.Provider value={Firebase.instance}>
              <MusicProvider>
                <AuthProvider>
                  <AppHeader />
                  <Component {...pageProps} />
                  <AppFooter />
                </AuthProvider>
              </MusicProvider>
            </FirebaseContext.Provider>
          </PersistGate>
        </Provider>
      </ChakraProvider>
    </>
  )
}

export default App
