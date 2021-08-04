import { Request, Response } from 'express'
import { Supabase } from '../Service/Supabase'

export async function authUrl(_: Request, res: Response): Promise<any> {
  const { url: google } = await Supabase.build().auth.signIn({ provider: 'google' }, process.env.API_URL ? { redirectTo: process.env.API_URL } : {})
  const { url: twitter } = await Supabase.build().auth.signIn({ provider: 'twitter' }, process.env.API_URL ? { redirectTo: process.env.API_URL } : {})
  return res.send({ google, twitter })
}