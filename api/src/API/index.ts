import { Router } from 'express'
import { RequestWrapper } from '../Util/RequestWrapper'
import { authUrl, me } from './Auth'
import { create as createComment, find as findComment, remove as removeComment, retrieve as retrieveComment, update as updateComment } from './Comment'
import { create as createFeed, find as findFeed, like, remove as removeFeed, retrieve as retrieveFeed, update as updateFeed } from './Feed'
import { JWTAuth, multerHandler } from './Middleware'
import { create as createPet, find as findPet, remove as removePet, retrieve as retrievePet, update as updatePet } from './Pet'
import { upload } from './Upload'

export function API(): Router {
  const router = Router()

  // auth
  router.get('/authUrl', RequestWrapper(authUrl))
  router.get('/users/me', JWTAuth, RequestWrapper(me))

  // upload
  router.post('/upload', JWTAuth, multerHandler, RequestWrapper(upload))

  // pet
  router.post('/pets', JWTAuth, RequestWrapper(createPet))
  router.get('/pets', JWTAuth, RequestWrapper(findPet))
  router.get('/pets/:id', JWTAuth, RequestWrapper(retrievePet))
  router.patch('/pets/:id', JWTAuth, RequestWrapper(updatePet))
  router.delete('/pets/:id', JWTAuth, RequestWrapper(removePet))

  // feed
  router.post('/feeds', JWTAuth, RequestWrapper(createFeed))
  router.get('/feeds', JWTAuth, RequestWrapper(findFeed))
  router.get('/feeds/:id', JWTAuth, RequestWrapper(retrieveFeed))
  router.patch('/feeds/:id', JWTAuth, RequestWrapper(updateFeed))
  router.delete('/feeds/:id', JWTAuth, RequestWrapper(removeFeed))
  router.post('/feeds/:id/like', JWTAuth, RequestWrapper(like))

  // comment
  router.post('/comments', JWTAuth, RequestWrapper(createComment))
  router.get('/comments', JWTAuth, RequestWrapper(findComment))
  router.get('/comments/:id', JWTAuth, RequestWrapper(retrieveComment))
  router.patch('/comments/:id', JWTAuth, RequestWrapper(updateComment))
  router.delete('/comments/:id', JWTAuth, RequestWrapper(removeComment))

  return router
}