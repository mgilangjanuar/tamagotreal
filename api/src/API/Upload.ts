import { Request, Response } from 'express'

export async function upload(req: Request, res: Response): Promise<any> {
  return res.send({ file: req.file })
}