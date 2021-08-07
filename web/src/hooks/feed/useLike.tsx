import axios from 'axios'
import { useState } from 'react'

export function useLike(): [(id: string) => void, string | null, any, any, () => void] {
  const [error, setError] = useState<any>(undefined)
  const [feed, setFeed] = useState<any>(undefined)
  const [loading, setLoading] = useState<string | null>(null)

  return [(id: string) => {
    setLoading(id)
    axios.post(`${process.env.REACT_APP_API_URL}/api/feeds/${id}/like`, {}, { withCredentials: true })
      .then(({ data }) => {
        setFeed(data.feed)
        setError(null)
        setLoading(null)
      })
      .catch(error => {
        setError(error.response || error)
        setLoading(null)
      })
  }, loading, feed, error, () => setError(undefined)]
}