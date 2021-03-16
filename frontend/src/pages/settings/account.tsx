import { NextPage } from 'next'
import styles from '@/styles/pages/register.module.scss'
import { SEOMeta } from '@/components/SEOMeta'
import { useRequireUser } from '@/hooks/useRequireUser'
import { UserProfileForm } from '@/components/UserProfileForm'
import { UserServiceConnection } from '@/components/UserServiceConnection'
import { Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/react'

const AccountSettingPage: NextPage = () => {
  useRequireUser()

  return (
    <>
      <SEOMeta title="アカウント設定" path="/register" />
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
              <TabPanel>
                <UserProfileForm />
              </TabPanel>
              <TabPanel>
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
