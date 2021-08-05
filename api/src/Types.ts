export type UserAuth = {
  aud: string,
  exp: number,
  sub: string,
  email: string,
  app_metadata: {
    provider: string
  },
  user_metadata: Record<string, any>,
  role: string
}

export type Pet = {
  id?: string,
  name: string,
  type: string,
  breed?: string,
  birth_date?: Date,
  owner: string
}

export type Feed = {
  id?: string,
  url: string,
  caption?: string,
  created_at: string,
  pet_id: number
}

declare module 'http' {
  interface IncomingMessage {
    user?: UserAuth
  }
}