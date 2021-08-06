import { Button, Layout, Typography } from 'antd'
import JSCookie from 'js-cookie'
import QueryString from 'querystring'
import React, { useEffect } from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { useLogin } from '../hooks/useLogin'

const Home: React.FC = () => {
  const [loginAction, LoginModal] = useLogin()

  useEffect(() => {
    const token = QueryString.decode(window.location.hash.replace(/^\#/gi, ''))
    if (token.access_token) {
      JSCookie.set('authorization', token.access_token)
      JSCookie.set('refresh_token', token.refresh_token)
      window.location.replace('/dashboard')
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return <div>
    <Navbar />
    <Layout.Content style={{ minHeight: '76vh', position: 'relative' }}>
      <div style={{ textAlign: 'center', padding: '10px 20px', position: 'absolute', top: '50%', transform: 'translateY(-50%)', msTransform: 'translateY(-50%)', width: '100%' }}>
        <Typography.Paragraph>
          <img src="/tamagotchi.png" style={{ width: '100%', maxWidth: '600px' }} />
        </Typography.Paragraph>
        <Typography.Paragraph>
          <Button onClick={loginAction} size="large" type="primary">Join Now! 🐹</Button>
        </Typography.Paragraph>
        <Typography.Paragraph>
          <Typography.Text type="secondary">Tamagotchi for your real pets</Typography.Text>
        </Typography.Paragraph>
      </div>
      <LoginModal />
    </Layout.Content>

    <Footer />
  </div>
}

export default Home