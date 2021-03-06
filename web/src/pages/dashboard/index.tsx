import { Layout } from 'antd'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { useMe } from '../../hooks/useMe'
import Main from './Main'
import Post from './Post'
import Profile from './Profile'

interface PageProps extends RouteComponentProps<{
  page: string
}> {}

const Dashboard: React.FC<PageProps> = ({ match }) => {
  const history = useHistory()
  const [user] = useMe()
  const [title, setTitle] = useState<string>('Home')

  useEffect(() => {
    if (user === null) {
      history.replace('/')
    }
  }, [history, user])

  useEffect(() => {
    if (match.params.page === 'main') {
      setTitle('Home')
    } else if (match.params.page === 'post') {
      setTitle('New Post')
    } if (match.params.page === 'profile') {
      setTitle('Profile')
    }
  }, [match])

  return <>
    <Navbar title={title} />
    <Layout style={{ flexDirection: 'row' }}>
      <Layout.Content style={{ padding: '10px 10px 24px', margin: 0, minHeight: 280 }}>
        {match.params.page === 'main' ? <Main user={user} /> : ''}
        {match.params.page === 'post' ? <Post user={user} /> : ''}
        {match.params.page === 'profile' ? <Profile user={user} /> : ''}
      </Layout.Content>
    </Layout>
  </>
}

export default Dashboard