import axios from 'axios'
import { useState } from 'react'

export function useUpdate(): [(id: string, data: Record<string, any>) => void, any, () => void] {
  const [error, setError] = useState<any>(undefined)

  return [(id: string, data: Record<string, string>) => {
    axios.patch(`${process.env.REACT_APP_API_URL}/api/pets/${id}`, data, { withCredentials: true })
      .then(() => setError(null))
      .catch(error => {
        setError(error.response || error)
      })
  }, error, () => setError(undefined)]
}