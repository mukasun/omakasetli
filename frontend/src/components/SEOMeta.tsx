import Head from 'next/head'
import { config } from '@@/site.config'

type Props = {
  title: string
  path?: string
  description?: string
  ogImageUrl?: string
  noindex?: boolean
  removeSiteNameFromTitle?: boolean
}

export const SEOMeta: React.FC<Props> = (props) => {
  const { path, title, description, ogImageUrl, noindex, removeSiteNameFromTitle } = props
  const pageUrl = `${config.siteRoot}${path || ''}`

  return (
    <Head>
      <title>{removeSiteNameFromTitle ? title : `${title} | ${config.siteMeta.title}`}</title>
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site" content={config.siteMeta.title} />
      <meta property="og:image" content={ogImageUrl || `${config.siteRoot}/og.png`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImageUrl || `${config.siteRoot}/og.png`} />
      {!!description && (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
        </>
      )}
      {path && <link rel="canonical" href={pageUrl} />}
      {noindex && <meta name="robots" content="noindex" />}
    </Head>
  )
}
