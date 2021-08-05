import { Layout } from 'antd'
import React, { useEffect } from 'react'
import { useThemeSwitcher } from 'react-css-theme-switcher'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Navigation from '../../components/Navigation'
import { useMe } from '../../hooks/useMe'
import Main from './Main'
import Post from './Post'
import Profile from './Profile'

interface PageProps extends RouteComponentProps<{
  page: string
}> {}

const Dashboard: React.FC<PageProps> = ({ match }) => {
  const { switcher, themes } = useThemeSwitcher()
  const history = useHistory()
  const [user] = useMe()

  useEffect(() => {
    switcher({ theme: themes[user?.theme || 'light'] })
  }, [user])

  useEffect(() => {
    if (user === null) {
      history.replace('/')
    }
  }, [history, user])

  return <>
    <Navbar />
    <Layout style={{ flexDirection: 'row' }}>
      <Navigation page={match.params.page} />
      <Layout.Content style={{ padding: '10px 24px 24px', margin: 0, minHeight: 280 }}>
        {match.params.page === 'main' ? <Main user={user} /> : ''}
        {match.params.page === 'post' ? <Post user={user} /> : ''}
        {match.params.page === 'profile' ? <Profile user={user} /> : ''}
      </Layout.Content>
    </Layout>
  </>
}

export default Dashboard