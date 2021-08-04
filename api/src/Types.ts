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

declare module 'http' {
  interface IncomingMessage {
    rawBody?: any,
    user?: UserAuth
  }
}