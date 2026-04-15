declare module 'passport-jwt' {
  export interface StrategyOptions {
    jwtFromRequest: (request: unknown) => string | null
    ignoreExpiration?: boolean
    secretOrKey?: string
  }

  export class Strategy {
    constructor(options: StrategyOptions)
  }

  export const ExtractJwt: {
    fromAuthHeaderAsBearerToken(): (request: unknown) => string | null
  }
}
