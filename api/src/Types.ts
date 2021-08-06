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
  avatar_url: string,
  breed?: string,
  birth_date?: Date,
  owner: string
}

export type Feed = {
  id?: string,
  url: string,
  caption?: string,
  created_at: string,
  likes?: string[],
  pet_id: string,
  owner: string
}

export type Comment = {
  id?: string,
  feed_id: string,
  content: string,
  pet_id: string,
  created_at: string,
  owner: string
}

declare module 'http' {
  interface IncomingMessage {
    user?: UserAuth
  }
}