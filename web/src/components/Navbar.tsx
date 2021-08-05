import { SettingOutlined, LoginOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'

const Navbar: React.FC = () => {
  const [login, LoginModal, me] = useLogin()

  return <Layout.Header>
    <Link to="/"><div className="logo">🐹 Tamagotreal</div></Link>
    <Menu style={{ float: 'right' }} theme="dark" mode="horizontal">
      <Menu.Item key="dashboard" onClick={login} icon={me === null ? <LoginOutlined /> : <SettingOutlined />}>{me === null ? 'Login' : 'Dashboard'}</Menu.Item>
    </Menu>
    <LoginModal />
  </Layout.Header>
}

export default Navbar