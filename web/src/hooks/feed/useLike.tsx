import axios from 'axios'
import { useState } from 'react'

export function useLike(): [(id: string) => void, any, any, () => void] {
  const [error, setError] = useState<any>(undefined)
  const [feed, setFeed] = useState<any>(undefined)

  return [(id: string) => {
    axios.post(`${process.env.REACT_APP_API_URL}/api/feeds/${id}/like`, {}, { withCredentials: true })
      .then(({ data }) => {
        setFeed(data.feed)
        setError(null)
      })
      .catch(error => {
        setError(error.response || error)
      })
  }, feed, error, () => setError(undefined)]
}