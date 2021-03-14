import { config } from '@@/site.config'
import { SEOMeta } from '@/components/SEOMeta'
import { NextPage } from 'next'

const Page: NextPage = () => {
  return (
    <>
      <SEOMeta
        title={config.siteMeta.title}
        description={config.siteMeta.description}
        path="/"
        removeSiteNameFromTitle={true}
      />
    </>
  )
}

export default Page
