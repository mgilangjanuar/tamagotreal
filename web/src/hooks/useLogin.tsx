import { GithubOutlined, GoogleOutlined, TwitterOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'
import JSCookie from 'js-cookie'
import React, { useEffect } from 'react'
import { useAuthUrl } from './useAuthUrl'
import { useMe } from './useMe'
import { useRefreshToken } from './useRefreshToken'

export function useLogin(): [React.FC, any] {
  const [refreshToken] = useRefreshToken()

  const url = useAuthUrl()
  const [user, refetch] = useMe()

  useEffect(() => {
    if (!user && JSCookie.get('refresh_token')) {
      refreshToken()
      refetch()
    }
  }, [user])

  return [() => {
    const login = (provider: string) => window.location.replace((url as any)?.[provider] as string)
    return <div>
      <Typography.Paragraph style={{ textAlign: 'center' }}>
        <Button onClick={() => login('google')} type="default" block icon={<GoogleOutlined />}>Sign in with Google</Button>
      </Typography.Paragraph>
      <Typography.Paragraph style={{ textAlign: 'center' }}>
        <Button onClick={() => login('twitter')} type="primary" block icon={<TwitterOutlined />}>Sign in with Twitter</Button>
      </Typography.Paragraph>
      <Typography.Paragraph style={{ textAlign: 'center' }}>
        <Button onClick={() => login('github')} style={{ background: '#000', color: '#fff' }} block icon={<GithubOutlined />}>Sign in with GitHub</Button>
      </Typography.Paragraph>
    </div>
  }, user]
}