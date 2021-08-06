import axios from 'axios'
import { useState } from 'react'

export function useCreate(): [(data: Record<string, any>) => void, any, any, () => void] {
  const [error, setError] = useState<any>(undefined)
  const [pet, setPet] = useState<any>()

  return [(data: Record<string, string>) => {
    axios.post(`${process.env.REACT_APP_API_URL}/api/pets`, data, { withCredentials: true })
      .then(({ data }) => {
        setPet(data.pet)
        setError(null)
      })
      .catch(error => {
        setError(error.response || error)
      })
  }, pet, error, () => setError(undefined)]
}