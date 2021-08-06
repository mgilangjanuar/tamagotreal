import { Request, Response } from 'express'
import { Supabase } from '../Service/Supabase'

export async function authUrl(_: Request, res: Response): Promise<any> {
  const { url: google } = await Supabase.build().auth.signIn({ provider: 'google' }, process.env.API_URL ? { redirectTo: process.env.API_URL } : {})
  const { url: twitter } = await Supabase.build().auth.signIn({ provider: 'twitter' }, process.env.API_URL ? { redirectTo: process.env.API_URL } : {})
  return res.send({ google, twitter })
}

export async function refreshToken(req: Request, res: Response): Promise<any> {
  if (!req.body.refreshToken) {
    throw { status: 400, body: { error: 'refreshToken is required' } }
  }
  const { error, data } = await Supabase.build().auth.api.refreshAccessToken(req.body.refreshToken)
  if (error) {
    throw { status: 401, body: { error: error.message } }
  }
  return res.send(data)
}

export async function me(req: Request, res: Response): Promise<any> {
  return res.send({ user: req.user })
}