import { Col, Divider, Layout, Row, Typography } from 'antd'
import JSCookie from 'js-cookie'
import QueryString from 'querystring'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { useLogin } from '../hooks/useLogin'

const Home: React.FC = () => {
  const [LoginComponent, user] = useLogin()
  const history = useHistory()

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

  useEffect(() => {
    if (user) {
      history.push('/dashboard')
    }
  }, [user])

  return <div>
    <Navbar />
    <Layout.Content style={{ marginTop: '40px' }}>
      <Row>
        <Col lg={{ span: 10, offset: 7 }} md={{ span: 16, offset: 4 }} sm={{ span: 20, offset: 2 }} span={24}>
          <Typography.Paragraph style={{ textAlign: 'center' }}>
            <img src="/Screen Shot 2021-08-07 at 09.29.14_samsung-galaxys20-cosmicgrey-portrait.png" style={{ width: '100%', maxWidth: '180px' }} />
            <img src="/Screen Shot 2021-08-07 at 09.32.27_samsung-galaxys20-cosmicgrey-portrait.png" style={{ width: '100%', maxWidth: '180px' }} />
          </Typography.Paragraph>
          <div style={{ padding: '10px 10px 24px' }}>
            <Typography.Paragraph style={{ textAlign: 'center' }}>
              <Typography.Text type="secondary">Tamagotchi for your real pets 🐹 🐱 🐶</Typography.Text>
            </Typography.Paragraph>
            <Divider>Sign In</Divider>
            <LoginComponent />
          </div>
        </Col>
      </Row>
    </Layout.Content>

    <Footer />
  </div>
}

export default Home