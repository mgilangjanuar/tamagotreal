import axios from 'axios'
import { useState } from 'react'

export function useCreate(): [(data: Record<string, any>) => void, boolean, any, any, () => void] {
  const [error, setError] = useState<any>(undefined)
  const [comment, setComment] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)

  return [(data: Record<string, string>) => {
    setLoading(true)
    axios.post(`${process.env.REACT_APP_API_URL}/api/comments`, data, { withCredentials: true })
      .then(({ data }) => {
        setError(null)
        setComment(data.comment)
        setLoading(false)
      })
      .catch(error => {
        setError(error.response || error)
        setLoading(false)
      })
  }, loading, comment, error, () => setError(undefined)]
}