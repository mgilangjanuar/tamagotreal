import axios from 'axios'
import { useState } from 'react'

export function useCreate(): [(data: Record<string, any>) => void, boolean, any, () => void] {
  const [error, setError] = useState<any>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  return [(data: Record<string, string>) => {
    setLoading(true)
    axios.post(`${process.env.REACT_APP_API_URL}/api/feeds`, data, { withCredentials: true })
      .then(() => {
        setError(null)
        setLoading(false)
      })
      .catch(error => {
        setError(error.response || error)
        setLoading(false)
      })
  }, loading, error, () => setError(undefined)]
}