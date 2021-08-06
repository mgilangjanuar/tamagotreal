import axios from 'axios'
import { useState } from 'react'

export function useUpdate(): [(id: string) => void, any, () => void] {
  const [error, setError] = useState<any>(undefined)

  return [(id: string) => {
    axios.post(`${process.env.REACT_APP_API_URL}/api/feeds/${id}/like`, {}, { withCredentials: true })
      .then(() => setError(null))
      .catch(error => {
        setError(error.response || error)
      })
  }, error, () => setError(undefined)]
}