import { LeftOutlined } from '@ant-design/icons'
import { Layout } from 'antd'
import React from 'react'
import { useHistory } from 'react-router-dom'

interface Props {
  back?: boolean,
  title?: string
}

const Navbar: React.FC<Props> = ({ back, title }) => {
  const history = useHistory()

  return <Layout.Header style={{ ...title || back ? { padding: '0 15px' } : {} }}>
    <div onClick={() => back ? history.goBack() : history.push('/dashboard')} className="logo">
      {back ? <><LeftOutlined /> Back</> : title || '🐹 Tamagotreal'}
    </div>
  </Layout.Header>
}

export default Navbar