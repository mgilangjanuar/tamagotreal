import axios from 'axios'
import { useState } from 'react'

export function useFind(): [(data: Record<string, any>) => void, any[], any, () => void] {
  const [error, setError] = useState<any>(undefined)
  const [pets, setPets] = useState<any[]>([])

  return [(data: Record<string, string>) => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/pets`, { params: data, withCredentials: true })
      .then(({ data }) => {
        setPets(data.pets || [])
        setError(null)
      })
      .catch(error => {
        setError(error.response || error)
      })
  }, pets, error, () => setError(undefined)]
}