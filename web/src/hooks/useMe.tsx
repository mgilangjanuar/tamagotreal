import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRefreshToken } from './useRefreshToken'

export function useMe(): [any | undefined, () => void] {
  const [user, setUser] = useState<any>(undefined)
  const [refreshToken] = useRefreshToken()

  useEffect(() => {
    if (user === undefined) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, { withCredentials: true })
        .then(({ data }) => {
          setUser(data.user)
        })
        .catch((error) => {
          if (error.response.status === 401) {
            refreshToken()
          }
          setUser(null)
        })
    }
  }, [user])

  return [user, () => setUser(undefined)]
}