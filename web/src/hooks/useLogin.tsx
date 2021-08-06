import { GoogleOutlined, TwitterOutlined } from '@ant-design/icons'
import { Button, Modal, Tooltip, Typography } from 'antd'
import JSCookie from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { useAuthUrl } from './useAuthUrl'
import { useMe } from './useMe'
import { useRefreshToken } from './useRefreshToken'

export function useLogin(): [() => void, React.FC, any] {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [refreshToken] = useRefreshToken()

  const url = useAuthUrl()
  const [user, refetch] = useMe()
  const history = useHistory()

  useEffect(() => {
    if (!user && JSCookie.get('refresh_token')) {
      refreshToken()
      refetch()
    }
  }, [user])

  return [() => {
    if (user) {
      history.push('/dashboard')
    } else {
      setIsModalVisible(true)
    }
  }, () => {
    const login = (provider: string) => window.location.replace((url as any)?.[provider] as string)
    return <Modal title="Sign In" visible={isModalVisible} footer={null} onCancel={() => setIsModalVisible(false)}>
      <Typography.Paragraph style={{ textAlign: 'center' }}>
        <Button onClick={() => login('google')} type="default" block icon={<GoogleOutlined />}>Sign in with Google</Button>
      </Typography.Paragraph>
      <Typography.Paragraph style={{ textAlign: 'center' }}>
        <Tooltip title="Coming soon">
          <Button disabled onClick={() => login('twitter')} type="primary" block icon={<TwitterOutlined />}>Sign in with Twitter</Button>
        </Tooltip>
      </Typography.Paragraph>
    </Modal>
  }, user]
}