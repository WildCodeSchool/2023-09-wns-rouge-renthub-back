import { Request, Response } from 'express'
import { UserContext } from './UserContext'

export type MyContext = {
  req: Request
  res: Response
  user?: UserContext
}
