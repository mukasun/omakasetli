import { config } from '@@/site.config'
import { SEOMeta } from '@/components/SEOMeta'
import { NextPage } from 'next'

const parseSpotifyCallbackURL = (callbackURL: string): { [key: string]: string } => {
  return callbackURL
    .split('&')
    .map((v) => v.split('='))
    .reduce((pre, [key, value]) => ({ ...pre, [key]: value }), {})
}

const Page: NextPage = () => {
  const response_url = window.location.search.substring(1)
  const { code, error } = parseSpotifyCallbackURL(response_url)

  if (!error) {
    window.opener.setSpotifyAuthToken({ code })
  }
  window.close()

  return (
    <>
      <SEOMeta title={config.siteMeta.title} />
    </>
  )
}

export default Page
