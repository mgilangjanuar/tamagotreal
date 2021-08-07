import { LeftOutlined } from '@ant-design/icons'
import { Layout } from 'antd'
import React from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'

interface Props {
  back?: boolean,
  title?: string
}

const Navbar: React.FC<Props> = ({ back, title }) => {
  const history = useHistory()

  return <>
    {title ? <Helmet>
      <title>{title} | Tamagotreal</title>
    </Helmet> : ''}
    <Layout.Header style={{ ...title || back ? { padding: '0 15px' } : {} }}>
      <div style={{ cursor: 'pointer' }} onClick={e => back ? history.goBack() : e.preventDefault()} className="logo">
        {back ? <><LeftOutlined /> Back</> : title || '🐹 Tamagotreal'}
      </div>
    </Layout.Header>
  </>
}

export default Navbar