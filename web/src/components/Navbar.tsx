import { Layout } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {
  return <Layout.Header>
    <Link to="/dashboard"><div className="logo">🐹 Tamagotreal</div></Link>
  </Layout.Header>
}

export default Navbar