import axios from 'axios'
import { useState } from 'react'

export function useRetrieve(): [(id: string) => void, any, any, () => void] {
  const [error, setError] = useState<any>(undefined)
  const [feeds, setFeeds] = useState<any[]>([])

  return [(id: string) => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/feeds/${id}`, { withCredentials: true })
      .then(({ data }) => {
        setFeeds(data.feed || [])
        setError(null)
      })
      .catch(error => {
        setError(error.response || error)
      })
  }, feeds, error, () => setError(undefined)]
}