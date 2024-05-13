//-----------------------------------------
//------------------GRAPHQL----------------
//-----------------------------------------

import { buildSchema } from 'type-graphql'

//-----------------------------------------
//-----------------RESOLVERS---------------
//-----------------------------------------

import { UsersResolver } from './resolvers/Users'
import { customAuthChecker } from './auth'
import { PictureResolver } from './resolvers/Pictures.resolver'
import { CategoriesResolver } from './resolvers/Category.resolver'
import { RolesResolver } from './resolvers/Roles.resolver'
import { VerificationCodeResolver } from './resolvers/VerificationCode'
import { ProductReferenceResolver } from './resolvers/ProductReference.resolver'
import { StockResolver } from './resolvers/Stocks.resolver'
import { CartResolver } from './resolvers/Carts.resolver'

export async function getSchema() {
  const schema = await buildSchema({
    resolvers: [
      UsersResolver,
      PictureResolver,
      CategoriesResolver,
      VerificationCodeResolver,
      RolesResolver,
      ProductReferenceResolver,
      StockResolver,
      CartResolver
    ],
    authChecker: customAuthChecker,
  })
  return schema
}
