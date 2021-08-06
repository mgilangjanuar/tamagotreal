import { HeartFilled, GithubFilled } from '@ant-design/icons'
import { Divider, Layout, Space, Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
  return <Layout.Footer style={{ textAlign: 'center' }}>
    <Divider />
    <Typography.Paragraph>
      <Typography.Text>🐹 Tamagotreal &copy; 2021</Typography.Text><br />
      <Typography.Text type="secondary">
        <Link to="/">Home</Link> &middot; <Link to="/terms">Terms</Link> &middot; <Link to="/privacy">Privacy</Link> &middot; <a href="https://github.com/mgilangjanuar/tamagotreal"><GithubFilled /> GitHub</a>
      </Typography.Text>
    </Typography.Paragraph>
    <br />
    <Space direction="vertical">
      <a href="https://vercel.com?utm_source=restfire-studio&utm_campaign=oss">
        <img style={{ width: '100%', maxWidth: '160px' }} src="https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg" alt="Powered by Vercel" />
      </a>
      <Typography.Text type="danger"><HeartFilled /></Typography.Text>
      <a href="https://supabase.io">
        <img style={{ width: '100%', maxWidth: '160px' }} src="https://supabase.io/new/images/logo-light.png" />
      </a>
    </Space>
  </Layout.Footer>
}

export default Footer