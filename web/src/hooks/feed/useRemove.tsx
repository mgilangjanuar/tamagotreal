import axios from 'axios'
import { useState } from 'react'

export function useRemove(): [(id: string) => void, string | null, any, () => void] {
  const [error, setError] = useState<any>(undefined)
  const [loading, setLoading] = useState<string | null>(null)

  return [(id: string) => {
    setLoading(id)
    axios.delete(`${process.env.REACT_APP_API_URL}/api/feeds/${id}`, { withCredentials: true })
      .then(() => {
        setError(null)
        setLoading(null)
      })
      .catch(error => {
        setError(error.response || error)
        setLoading(null)
      })
  }, loading, error, () => setError(undefined)]
}