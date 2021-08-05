import axios from 'axios'
import { useState } from 'react'

export function useCreate(): [(data: Record<string, any>) => void, any, () => void] {
  const [error, setError] = useState<any>(undefined)

  return [(data: Record<string, string>) => {
    axios.post(`${process.env.REACT_APP_API_URL}/api/feeds`, data, { withCredentials: true })
      .then(() => setError(null))
      .catch(error => {
        setError(error.response || error)
      })
  }, error, () => setError(undefined)]
}