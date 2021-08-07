import { LeftOutlined } from '@ant-design/icons'
import { Layout } from 'antd'
import React from 'react'
import { useHistory } from 'react-router-dom'

interface Props {
  back?: boolean
}

const Navbar: React.FC<Props> = ({ back }) => {
  const history = useHistory()

  return <Layout.Header>
    <a onClick={() => back ? history.goBack() : history.push('/dashboard')} className="logo">
      {back ? <><LeftOutlined /> Back</> : '🐹 Tamagotreal'}
    </a>
  </Layout.Header>
}

export default Navbar