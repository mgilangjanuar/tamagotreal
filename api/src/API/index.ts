import { Router } from 'express'
import { RequestWrapper } from '../Util/RequestWrapper'
import { authUrl } from './Auth'

export function API(): Router {
  const router = Router()

  router.get('/authUrl', RequestWrapper(authUrl))

  return router
}