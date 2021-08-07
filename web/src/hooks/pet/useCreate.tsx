import axios from 'axios'
import { useState } from 'react'

export function useCreate(): [(data: Record<string, any>) => void, boolean, any, any, () => void] {
  const [error, setError] = useState<any>(undefined)
  const [pet, setPet] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)

  return [(data: Record<string, string>) => {
    setLoading(true)
    axios.post(`${process.env.REACT_APP_API_URL}/api/pets`, data, { withCredentials: true })
      .then(({ data }) => {
        setPet(data.pet)
        setError(null)
        setLoading(false)
      })
      .catch(error => {
        setError(error.response || error)
        setLoading(false)
      })
  }, loading, pet, error, () => setError(undefined)]
}