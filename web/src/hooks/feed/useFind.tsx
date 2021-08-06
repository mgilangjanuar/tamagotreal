import axios from 'axios'
import { useState } from 'react'

export function useFind(): [(data?: Record<string, any>) => void, any[], any, () => void] {
  const [error, setError] = useState<any>(undefined)
  const [feeds, setFeeds] = useState<any[]>([])

  return [(data?: Record<string, string>) => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/feeds`, { params: data, withCredentials: true })
      .then(({ data }) => {
        setFeeds(data.feeds || [])
        setError(null)
      })
      .catch(error => {
        setError(error.response || error)
      })
  }, feeds, error, () => setError(undefined)]
}