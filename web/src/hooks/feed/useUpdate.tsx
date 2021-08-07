import axios from 'axios'
import { useState } from 'react'

export function useUpdate(): [(id: string, data: Record<string, any>) => void, string | null, any, () => void] {
  const [error, setError] = useState<any>(undefined)
  const [loading, setLoading] = useState<string | null>(null)

  return [(id: string, data: Record<string, string>) => {
    setLoading(id)
    axios.patch(`${process.env.REACT_APP_API_URL}/api/feeds/${id}`, data, { withCredentials: true })
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