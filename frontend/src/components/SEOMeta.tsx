import Head from 'next/head'
import { config } from '@@/site.config'

type Props = {
  title?: string
  path?: string
  noindex?: boolean
  removeSiteNameFromTitle?: boolean
}

export const SEOMeta: React.FC<Props> = (props) => {
  const { path, title, noindex, removeSiteNameFromTitle } = props
  const pageUrl = `${config.siteRoot}${path || ''}`

  return (
    <Head>
      {title && (
        <title>{removeSiteNameFromTitle ? title : `${title} | ${config.siteMeta.title}`}</title>
      )}
      <meta property="og:title" content={title} />
      {path && <link rel="canonical" href={pageUrl} />}
      {noindex && <meta name="robots" content="noindex" />}
    </Head>
  )
}
