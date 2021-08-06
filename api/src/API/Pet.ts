import { Request, Response } from 'express'
import { Supabase } from '../Service/Supabase'
import { Pet } from '../Types'

export async function create(req: Request, res: Response): Promise<any> {
  const pet = await Supabase.build().from<Pet>('pets').insert([{
    ...req.body,
    owner: req.user.email
  }])
  if (pet.error) {
    throw { status: 400, body: { error: pet.error.message } }
  }
  return res.send({ pet: pet.data[0] })
}

export async function find(req: Request, res: Response): Promise<any> {
  const pets = await Supabase.build().from<Pet>('pets').select().match(req.query)
  return res.send({ pets: pets.data })
}

export async function retrieve(req: Request, res: Response): Promise<any> {
  const pet = await Supabase.build().from<Pet>('pets').select().eq('id', req.params.id)
  if (pet.error) {
    throw { status: 400, body: { error: pet.error.message } }
  }
  return res.send({ pet: pet.data[0] })
}

export async function update(req: Request, res: Response): Promise<any> {
  const pet = await Supabase.build().from<Pet>('pets').update({
    ...req.body,
    owner: req.user.email
  }).eq('id', req.params.id).eq('owner', req.user.email)
  return res.send({ pet: pet.data[0] })
}

export async function remove(req: Request, res: Response): Promise<any> {
  let pet = await Supabase.build().from<Pet>('pets').select().match({ id: req.params.id, owner: req.user.email })
  await Supabase.build().from<Pet>('feeds').delete().match({ pet_id: pet.data[0].id })
  pet = await Supabase.build().from<Pet>('pets').delete().match({ id: req.params.id, owner: req.user.email })
  if (pet.error) {
    throw { status: 400, body: { error: pet.error.message } }
  }
  if (!pet.data?.length) {
    throw { status: 404, body: { error: 'Pet not found' } }
  }
  return res.send({ pet: pet.data[0] })
}