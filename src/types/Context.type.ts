import { Request, Response } from 'express'
import { User } from '../entities/User.entity'

export interface MyContext {
  req: Request
  res: Response
  user?: User
}
