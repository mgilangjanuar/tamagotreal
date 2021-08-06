import axios from 'axios'
import { useState } from 'react'

export function useRemove(): [(id: string) => void, any, any, () => void] {
  const [error, setError] = useState<any>(undefined)
  const [comment, setComment] = useState<any>(undefined)

  return [(id: string) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/api/comments/${id}`, { withCredentials: true })
      .then(({ data }) => {
        setError(null)
        setComment(data.comment)
      })
      .catch(error => {
        setError(error.response || error)
      })
  }, comment, error, () => setError(undefined)]
}