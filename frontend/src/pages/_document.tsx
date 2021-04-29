import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { GA_TRACKING_ID } from '@/libs/gtag'
import { config } from '@@/site.config'

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="ja-JP">
        <Head>
          <meta charSet="utf-8" />
          <title>{`${config.siteMeta.title} | ${config.siteMeta.catchcopy}`}</title>
          <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
          <link rel="icon shortcut" type="image/png" href="/favicons/favicon.ico" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
          <link rel="manifest" href="/favicons/site.webmanifest" />
          <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color={config.themeColor} />
          <link rel="shortcut icon" href="/favicons/favicon.ico" />
          <meta name="msapplication-TileColor" content={config.themeColor} />
          <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
          <meta name="apple-mobile-web-app-title" content={config.siteMeta.title} />
          <meta name="theme-color" content={config.themeColor} />
          <meta name="format-detection" content="telephone=no" />
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content={`${config.siteMeta.title} | ${config.siteMeta.catchcopy}`}
          />
          <meta property="og:url" content={config.siteRoot} />
          <meta property="og:site" content={config.siteMeta.title} />
          <meta property="og:image" content={`${config.siteRoot}/default_og.png`} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content={`${config.siteRoot}/default_og.png`} />
          <meta name="description" content={config.siteMeta.description} />
          <meta property="og:description" content={config.siteMeta.description} />
          <meta name="twitter:description" content={config.siteMeta.description} />
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
          <script src="https://js-cdn.music.apple.com/musickit/v1/musickit.js" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
