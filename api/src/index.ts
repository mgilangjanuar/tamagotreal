require('dotenv').config({ path: '.env' })
import 'source-map-support/register'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { json, NextFunction, raw, Request, Response, static as serveStatic, urlencoded } from 'express'
import path from 'path'
import { API } from './API'

const app = express()
app.use(cors({
  credentials: true,
  origin: [
    /localhost:[0-9]{1,7}$/,
    'tamagotreal.vercel.app'
  ]
}))
app.use(json({ limit: process.env.EXPRESS_JSON_LIMIT || '3mb' }))
app.use(urlencoded({ extended: true, limit: process.env.EXPRESS_URL_ENCODED_LIMIT || '20mb' }))
app.use(raw({ limit: process.env.EXPRESS_RAW_LIMIT || '20mb' }))
app.use(cookieParser())

// serve api
app.use('/api', API())

// serve web
app.use(serveStatic(path.join(__dirname, '..', '..', 'web', 'build')))
app.use((req: Request, res: Response) => {
  try {
    return req.headers['accept'] !== 'application/json' ? res.sendFile(path.join(__dirname, '..', '..','web', 'build', 'index.html')) : res.status(404).send({ error: 'Not found' })
  } catch (error) {
    return res.send({ empty: true })
  }
})

// error handler
app.use((err: { status?: number, body?: Record<string, any> }, _: Request, res: Response, __: NextFunction) => {
  return res.status(err.status || 500).send(err.body || { error: 'Something error' })
})

app.listen(3000, () => console.log('listen at :3000...'))