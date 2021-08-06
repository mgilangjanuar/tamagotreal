import axios from 'axios'
import { useState } from 'react'
import { useRefreshToken } from '../useRefreshToken'

export function useFind(): [(data?: Record<string, any>) => void, any[], any, () => void] {
  const [error, setError] = useState<any>(undefined)
  const [feeds, setFeeds] = useState<any[]>([])
  const [refreshToken] = useRefreshToken()

  return [(data?: Record<string, string>) => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/feeds`, { params: data, withCredentials: true })
      .then(({ data }) => {
        setFeeds(data.feeds || [])
        setError(null)
      })
      .catch(error => {
        if (error.response.status === 401) {
          refreshToken()
        }
        setError(error.response || error)
      })
  }, feeds, error, () => setError(undefined)]
}