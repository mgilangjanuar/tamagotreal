import axios from 'axios'
import { useState } from 'react'

export function useLike(): [(id: string) => void, boolean, any, any, () => void] {
  const [error, setError] = useState<any>(undefined)
  const [feed, setFeed] = useState<any>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  return [(id: string) => {
    setLoading(true)
    axios.post(`${process.env.REACT_APP_API_URL}/api/feeds/${id}/like`, {}, { withCredentials: true })
      .then(({ data }) => {
        setFeed(data.feed)
        setError(null)
        setLoading(false)
      })
      .catch(error => {
        setError(error.response || error)
        setLoading(false)
      })
  }, loading, feed, error, () => setError(undefined)]
}