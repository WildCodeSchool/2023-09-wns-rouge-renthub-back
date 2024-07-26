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
import { RolesResolver } from './resolvers/Roles.resolver'
import { VerificationCodeResolver } from './resolvers/VerificationCodes.resolver'
import { ProductReferenceResolver } from './resolvers/ProductReferences.resolver'
import { StockResolver } from './resolvers/Stocks.resolver'
import { CartResolver } from './resolvers/Carts.resolver'
import { ProductCartResolver } from './resolvers/ProductCarts.resolver'
import { OrdersResolver } from './resolvers/Orders.resolver'
import { OrderStocksResolver } from './resolvers/OrderStocks.resolver'

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
      CartResolver,
      ProductCartResolver,
      OrdersResolver,
      OrderStocksResolver,
    ],
    authChecker: customAuthChecker,
  })
  return schema
}
