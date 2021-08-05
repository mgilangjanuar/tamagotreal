import axios from 'axios'
import { useEffect, useState } from 'react'

export function useMe(): [any | undefined, () => void] {
  const [user, setUser] = useState<any>(undefined)

  useEffect(() => {
    if (user === undefined) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, { withCredentials: true })
        .then(({ data }) => {
          setUser(data.user)
        })
        .catch(() => {
          setUser(null)
        })
    }
  }, [user])

  return [user, () => setUser(undefined)]
}