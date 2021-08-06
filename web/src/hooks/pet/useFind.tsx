import axios from 'axios'
import { useState } from 'react'
import { useRefreshToken } from '../useRefreshToken'

export function useFind(): [(data: Record<string, any>) => void, any[], any, () => void] {
  const [error, setError] = useState<any>(undefined)
  const [pets, setPets] = useState<any[]>([])
  const [refreshToken] = useRefreshToken()

  return [(data: Record<string, string>) => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/pets`, { params: data, withCredentials: true })
      .then(({ data }) => {
        setPets(data.pets || [])
        setError(null)
      })
      .catch(error => {
        if (error.response.status === 401) {
          refreshToken()
        }
        setError(error.response || error)
      })
  }, pets, error, () => setError(undefined)]
}