import { Divider, Layout, Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
  return <Layout.Footer style={{ textAlign: 'center' }}>
    <Divider />
    <p>
      <Typography.Text>🐹 Tamagotreal &copy; 2021</Typography.Text><br />
      <Typography.Text type="secondary">
        <Link to="/">Home</Link> &middot; <Link to="/terms">Terms</Link> &middot; <Link to="/privacy">Privacy</Link>
      </Typography.Text>
    </p>
  </Layout.Footer>
}

export default Footer