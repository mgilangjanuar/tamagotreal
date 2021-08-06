import axios from 'axios'
import { useState } from 'react'

export function useRemove(): [(id: string) => void, any, () => void] {
  const [error, setError] = useState<any>(undefined)

  return [(id: string) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/api/comments/${id}`, { withCredentials: true })
      .then(() => setError(null))
      .catch(error => {
        setError(error.response || error)
      })
  }, error, () => setError(undefined)]
}