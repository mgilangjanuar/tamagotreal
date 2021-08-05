import axios from 'axios'
import { useEffect, useState } from 'react'

export function useAuthUrl(): { google: string, twitter: string } | undefined {
  const [url, setUrl] = useState<{ google: string, twitter: string }>()

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/authUrl`)
      .then(({ data }) => setUrl(data as { google: string, twitter: string }))
      .catch(() => setUrl(undefined))
  }, [])

  return url
}