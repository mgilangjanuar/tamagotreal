import { Router } from 'express'
import { RequestWrapper } from '../Util/RequestWrapper'
import { authUrl, me } from './Auth'
import { JWTAuth } from './Middleware'

export function API(): Router {
  const router = Router()

  router.get('/authUrl', RequestWrapper(authUrl))
  router.get('/users/me', JWTAuth, RequestWrapper(me))

  return router
}