import { Request, Response } from 'express'
import { Supabase } from '../Service/Supabase'
import { Comment } from '../Types'

export async function create(req: Request, res: Response): Promise<any> {
  const comment = await Supabase.build().from<Comment>('comments').insert([req.body])
  if (comment.error) {
    throw { status: 400, body: { error: comment.error.message } }
  }
  return res.send({ comment: comment.data[0] })
}

export async function find(req: Request, res: Response): Promise<any> {
  const { rangeFrom, rangeTo, ...query } = req.query
  const comments = await Supabase.build().from<Comment>('comments')
    .select('*, pet:pet_id(*)')
    .match(query)
    .range(Number(rangeFrom) || 0, Number(rangeTo) || 9)
    .order('created_at', { ascending: false })
  return res.send({ comments: comments.data })
}

export async function retrieve(req: Request, res: Response): Promise<any> {
  const comment = await Supabase.build().from<Comment>('comments').select().eq('id', req.params.id)
  if (comment.error) {
    throw { status: 400, body: { error: comment.error.message } }
  }
  return res.send({ comment: comment.data[0] })
}

export async function update(req: Request, res: Response): Promise<any> {
  const comment = await Supabase.build().from<Comment>('comments').update({
    ...req.body,
    owner: req.user.email
  }).eq('id', req.params.id).eq('owner', req.user.email)
  return res.send({ comment: comment.data[0] })
}

export async function remove(req: Request, res: Response): Promise<any> {
  const comments = await Supabase.build().from<Comment>('comments').delete().match({ id: req.params.id, owner: req.user.email })
  if (comments.error) {
    throw { status: 400, body: { error: comments.error.message } }
  }
  if (!comments.data?.length) {
    throw { status: 404, body: { error: 'Comment not found' } }
  }
  return res.send({ comment: comments.data[0] })
}