import { Request, Response } from 'express'
import url from 'url'
import path from 'path'
import { Supabase } from '../Service/Supabase'
import { Feed, Pet } from '../Types'

export async function create(req: Request, res: Response): Promise<any> {
  const { pet_id: petId } = req.body
  if (!petId) {
    throw { status: 400, body: { error: 'Pet ID is required' } }
  }

  const pet = await Supabase.build().from<Pet>('pets').select().eq('id', petId).eq('owner', req.user.email)
  if (!pet.data?.length) {
    throw { status: 404, body: { error: 'Pet not found' } }
  }

  const feed = await Supabase.build().from<Feed>('feeds').insert([req.body])
  if (feed.error) {
    throw { status: 400, body: { error: feed.error.message } }
  }
  return res.send({ feed: feed.data[0] })
}

export async function find(req: Request, res: Response): Promise<any> {
  const criteria = Object.keys(req.query || {})?.[0]
  let feeds: any
  if (!criteria) {
    feeds = await Supabase.build().from<Feed>('feeds').select()
  } else {
    feeds = await Supabase.build().from<Feed>('feeds').select().eq(criteria as keyof Feed, req.query[criteria] as string)
  }
  return res.send({ feeds: feeds.data })
}

export async function retrieve(req: Request, res: Response): Promise<any> {
  const feed = await Supabase.build().from<Feed>('feeds').select().eq('id', req.params.id)
  return res.send({ feed: feed.data[0] })
}

export async function update(req: Request, res: Response): Promise<any> {
  const { pet_id: petId } = req.body
  if (petId) {
    const pet = await Supabase.build().from<Pet>('pets').select().eq('id', petId).eq('owner', req.user.email)
    if (!pet.data?.length) {
      throw { status: 404, body: { error: 'Pet not found' } }
    }
  }

  const feed = await Supabase.build().from<Feed>('feeds').update(req.body).eq('id', req.params.id)
  if (feed.error) {
    throw { status: 400, body: { error: feed.error.message } }
  }
  return res.send({ feed: feed.data[0] })
}

export async function remove(req: Request, res: Response): Promise<any> {
  const feed = await Supabase.build().from<Feed>('feeds').select().eq('id', req.params.id)
  if (!feed.data?.length) {
    throw { status: 404, body: { error: 'Feed not found' } }
  }

  const pet = await Supabase.build().from<Pet>('pets').select().eq('id', feed.data[0].id).eq('owner', req.user.email)
  if (!pet.data?.length) {
    throw { status: 404, body: { error: 'Pet not found' } }
  }

  await Supabase.build().from<Feed>('feeds').delete().eq('id', req.params.id)
  try {
    const filename = path.basename(url.parse(feed.data[0].url).pathname)
    await Supabase.build().storage.from('medias').remove([`${req.user.email}/${filename}`])
  } catch (error) {
    // ignore
  }
  return res.send({ feed: feed.data[0] })
}