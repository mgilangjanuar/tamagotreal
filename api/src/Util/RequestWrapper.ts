import { NextFunction, Request, RequestHandler, Response } from 'express'

export function RequestWrapper(requestHandler: RequestHandler): RequestHandler {

  return async function (req: Request, res: Response, next?: NextFunction) {
    try {
      await requestHandler(req, res, next)
    } catch (error) {
      console.error('FATAL: ', error)
      return next(error)
    }
  }
}
