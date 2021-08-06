import axios from 'axios'
import { useState } from 'react'

export function useCreate(): [(data: Record<string, any>) => void, any, any, () => void] {
  const [error, setError] = useState<any>(undefined)
  const [comment, setComment] = useState<any>()

  return [(data: Record<string, string>) => {
    axios.post(`${process.env.REACT_APP_API_URL}/api/comments`, data, { withCredentials: true })
      .then(({ data }) => {
        setError(null)
        setComment(data.comment)
      })
      .catch(error => {
        setError(error.response || error)
      })
  }, comment, error, () => setError(undefined)]
}