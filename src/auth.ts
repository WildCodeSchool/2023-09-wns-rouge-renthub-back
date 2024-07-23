import { AuthChecker, ResolverData } from 'type-graphql'
import jwt from 'jsonwebtoken'
import Cookies from 'cookies'
import { MyContext } from './types/Context.type'
import { User } from './entities/User.entity'
import { NextFunction, Request, Response } from 'express'

/**
 * Custom authentication checker function.
 * @param {MyContext} param.context - The context object.
 * @param {string[]} roles - The roles to check against in the Authorized() decorator.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the authentication is successful.
 */
export const customAuthChecker: AuthChecker<MyContext> = async (
  { context },
  roles
): Promise<boolean> => {
  // GET COOKIES //
  const cookies = new Cookies(context.req, context.res)
  const renthub_token = cookies.get('renthub_token')

  if (!renthub_token) {
    return false
  }

  try {
    // VERIFY TOKEN //
    const payload = jwt.verify(renthub_token, process.env.JWT_SECRET_KEY || '')
    if (typeof payload === 'object' && 'userId' in payload) {
      // GET USER //
      const user = await User.findOne({
        where: { id: payload.userId },
        relations: {
          cart: true,
          role: true,
          orders: true,
        },
      })
      if (!user) {
        console.error('User not found')

        return false
      }
      // SET USER IN CONTEXT //
      context.user = user

      // CHECK USER ROLE //
      return user.role.right.length === 0 || roles.includes(user.role.right)
    }
  } catch {
    console.error('Invalid renthub_token')

    return false
  }

  return false
}
export const checkUserRights = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const context: MyContext = { req, res, user: undefined }
  const roles: string[] = []

  // Créer un objet de type ResolverData<MyContext>
  const resolverData: ResolverData<MyContext> = {
    root: {},
    args: {},
    context,
    info: {} as any, // Vous pouvez remplacer `any` par le type approprié si nécessaire
  }

  const hasAccess = await customAuthChecker(resolverData, roles)

  if (hasAccess) {
    next()
  } else {
    res.status(403).json({ message: 'Access denied' })
  }
}
