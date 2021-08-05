import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import multer, { StorageEngine } from 'multer'
import { Supabase } from '../Service/Supabase'
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

export const multerHandler = multer({
  storage: new class implements StorageEngine {
    public async _handleFile(req: Request, file: Express.Multer.File, callback: (error?: any, info?: Partial<Express.Multer.File & { Key: string, Location: string }>) => void): Promise<void> {
      try {
        const resp = await Supabase.build().storage.from('medias').upload(`${req.user.email}/${file.originalname}`, file.stream, {
          cacheControl: '30',
          upsert: true,
          contentType: file.mimetype
        })
        callback(null, {
          ...resp.data,
          Location: `${process.env.SUPABASE_URL}/storage/v1/object/public/${resp.data.Key}`
        })
      } catch (error) {
        callback({ status: 400, body: error.response?.data || error.response || { error: error.toString() } })
      }
    }
    public _removeFile(_req: Request, _file: Express.Multer.File, _callback: (error: Error | null) => void): void {}
  }
}).single('upload')