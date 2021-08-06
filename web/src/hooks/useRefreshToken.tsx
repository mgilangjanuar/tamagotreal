import axios from 'axios'
import JSCookie from 'js-cookie'
import { useState } from 'react'

export function useRefreshToken(): [() => void, { access_token: string, refresh_token: string } | undefined] {
  const [auth, setAuth] = useState<{ access_token: string, refresh_token: string }>()

  return [() => JSCookie.get('refresh_token') ? axios.post(`${process.env.REACT_APP_API_URL}/api/auth/refreshToken`, { refreshToken: JSCookie.get('refresh_token') })
    .then(({ data }) => {
      JSCookie.set('authorization', data.access_token)
      JSCookie.set('refresh_token', data.refresh_token)
      setAuth(data as { access_token: string, refresh_token: string })
    })
    .catch(() => setAuth(undefined)) : null, auth]
}