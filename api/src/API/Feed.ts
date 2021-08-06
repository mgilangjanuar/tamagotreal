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

  const pet = await Supabase.build().from<Pet>('pets').select().match({ id: petId, owner: req.user.email })
  if (!pet.data?.length) {
    throw { status: 404, body: { error: 'Pet not found' } }
  }

  const feed = await Supabase.build().from<Feed>('feeds').insert([{ ...req.body, owner: req.user.email }])
  if (feed.error) {
    throw { status: 400, body: { error: feed.error.message } }
  }
  return res.send({ feed: feed.data[0] })
}

export async function find(req: Request, res: Response): Promise<any> {
  const { rangeFrom, rangeTo, ...query } = req.query
  const feeds = await Supabase.build().from<Feed>('feeds')
    .select('*, pet:pet_id(*)')
    .match(query)
    .range(Number(rangeFrom) || 0, Number(rangeTo) || 9)
    .order('created_at', { ascending: false })
  return res.send({ feeds: feeds.data })
}

export async function retrieve(req: Request, res: Response): Promise<any> {
  const feed = await Supabase.build().from<Feed>('feeds').select('*, pet:pet_id(*)').eq('id', req.params.id)
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

  const feed = await Supabase.build().from<Feed>('feeds').update(req.body).match({ id: req.params.id, owner: req.user.email })
  if (feed.error) {
    throw { status: 400, body: { error: feed.error.message } }
  }
  return res.send({ feed: feed.data[0] })
}

export async function remove(req: Request, res: Response): Promise<any> {
  const feed = await Supabase.build().from<Feed>('feeds').delete().match({ id: req.params.id, owner: req.user.email })
  try {
    const filename = path.basename(url.parse(feed.data[0].url).pathname)
    await Supabase.build().storage.from('medias').remove([`${req.user.email}/${filename}`])
  } catch (error) {
    // ignore
  }
  return res.send({ feed: feed.data[0] })
}

export async function like(req: Request, res: Response): Promise<any> {
  let feed = await Supabase.build().from<Feed>('feeds').select().eq('id', req.params.id)
  if (!feed.data?.length) {
    throw { status: 404, body: { error: 'Feed not found' } }
  }
  feed = await Supabase.build().from<Feed>('feeds')
    .update({
      likes: !feed.data[0].likes?.includes(req.user.email) ? [...feed.data[0].likes || [], req.user.email] : feed.data[0].likes?.filter(like => like !== req.user.email)
    })
    .match({ id: req.params.id, owner: req.user.email })
  if (feed.error) {
    throw { status: 400, body: { error: feed.error.message } }
  }
  return res.send({ feed: feed.data[0] })
}