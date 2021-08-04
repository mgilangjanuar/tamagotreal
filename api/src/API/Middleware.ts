import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { UserAuth } from '../Types'

export async function JWTAuth(req: Request, _: Response, next: NextFunction): Promise<void> {
  try {
    const token = (req.headers?.authorization || req.cookies?.['authorization'])?.replace(/^Bearer\ /gi, '')
    if (!token) throw new Error()

    const userAuth = jwt.verify(token, process.env.JWT_SECRET) as UserAuth
    if (!userAuth) throw new Error()

    req.user = userAuth
    return next()
  } catch (error) {
    return next({
      status: 401,
      body: {
        error: 'Unauthorized',
        ...error.message ? { details: error.message } : {}
      }
    })
  }
}