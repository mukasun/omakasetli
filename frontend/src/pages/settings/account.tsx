import { NextPage } from 'next'
import styles from '@/styles/pages/register.module.scss'
import { SEOMeta } from '@/components/SEOMeta'
import { UserProfileForm } from '@/components/UserProfileForm'
import { UserServiceConnection } from '@/components/UserServiceConnection'
import { Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/react'

const AccountSettingPage: NextPage = () => {
  return (
    <>
      <SEOMeta title="アカウント設定" />
      <section className="wrapper">
        <div className={styles.signinForm}>
          <div className={styles.titleContainer}>
            <p className={styles.title}>アカウント設定</p>
          </div>
          <Tabs align="center" isFitted>
            <TabList>
              <Tab>プロフィール</Tab>
              <Tab>サービス連携</Tab>
            </TabList>
            <TabPanels>
              <TabPanel style={{ padding: '16px 0px' }}>
                <UserProfileForm />
              </TabPanel>
              <TabPanel style={{ padding: '16px 0px' }}>
                <UserServiceConnection />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </section>
    </>
  )
}

export default AccountSettingPage
