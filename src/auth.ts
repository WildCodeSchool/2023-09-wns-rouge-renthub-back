import { AuthChecker } from 'type-graphql'
import jwt from 'jsonwebtoken'
import Cookies from 'cookies'
import { MyContext } from './index'
import { User } from './entities/User'

export async function getUserFromReq(req: any, res: any): Promise<User | null> {
  // may be recalled if called on field
  const cookies = new Cookies(req, res)
  const renthub_token = cookies.get('renthub_token')

  if (!renthub_token) {
    // console.error("missing renthub_token");
    return null
  }

  try {
    const payload = jwt.verify(renthub_token, process.env.JWT_SECRET_KEY || '')

    if (typeof payload === 'object' && 'userId' in payload) {
      const user = await User.findOneBy({ id: payload.userId })

      if (user !== null) {
        return Object.assign(user, { hashedPassword: undefined })
      } else {
        console.error('user not found')
        return null
      }
    } else {
      console.error('invalid renthub_token, msising userid')
      return null
    }
  } catch {
    console.error('invalid renthub_token')
    return null
  }
}

export const customAuthChecker: AuthChecker<MyContext> = async ({
  context,
}): Promise<boolean> => {
  const connectedUser = await getUserFromReq(context.req, context.res)

  if (connectedUser) {
    // TODO find better way for picture and role
    context.user = Object.assign(connectedUser, { picture: null, role: null })
    return true
  } else {
    return false
  }
}
