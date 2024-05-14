import { AuthChecker } from 'type-graphql'
import jwt from 'jsonwebtoken'
import Cookies from 'cookies'
import { MyContext } from './types/Context.type'
import { User } from './entities/User'

export const customAuthChecker: AuthChecker<MyContext> = async ({
  context,
}): Promise<boolean> => {
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
          role: true,
        },
      })
      if (!user) {
        console.error('User not found')
        return false
      }
      // SET USER IN CONTEXT //
      context.user = user
    }
  } catch {
    console.error('Invalid renthub_token')
    return false
  }
  return true
}
