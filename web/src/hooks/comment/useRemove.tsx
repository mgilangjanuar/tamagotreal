import axios from 'axios'
import { useState } from 'react'

export function useRemove(): [(id: string) => void, string | null, any, any, () => void] {
  const [error, setError] = useState<any>(undefined)
  const [comment, setComment] = useState<any>(undefined)
  const [loading, setLoading] = useState<string | null>(null)

  return [(id: string) => {
    setLoading(id)
    axios.delete(`${process.env.REACT_APP_API_URL}/api/comments/${id}`, { withCredentials: true })
      .then(({ data }) => {
        setError(null)
        setComment(data.comment)
        setLoading(null)
      })
      .catch(error => {
        setError(error.response || error)
        setLoading(null)
      })
  }, loading, comment, error, () => setError(undefined)]
}