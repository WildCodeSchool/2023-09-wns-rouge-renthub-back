//-----------------------------------------
//------------------GRAPHQL----------------
//-----------------------------------------

import { buildSchema } from 'type-graphql'

//-----------------------------------------
//-----------------RESOLVERS---------------
//-----------------------------------------

import { UsersResolver } from './resolvers/Users.resolver'
import { customAuthChecker } from './auth'
import { PictureResolver } from './resolvers/Pictures.resolver'
import { CategoriesResolver } from './resolvers/Categories.resolver'
import { VerificationCodeResolver } from './resolvers/VerificationCode'

export async function getSchema() {
  const schema = await buildSchema({
    resolvers: [
      UsersResolver,
      PictureResolver,
      CategoriesResolver,
      VerificationCodeResolver,
    ],
    authChecker: customAuthChecker,
  })
  return schema
}
