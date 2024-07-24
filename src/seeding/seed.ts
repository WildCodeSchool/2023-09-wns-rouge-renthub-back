import 'reflect-metadata'
import { config } from 'dotenv'
config()
import { runSeeders } from 'typeorm-extension'
import { dataSource } from '../datasource'

import MainSeeder from './main.seeder'
import { CartsFactory } from './factories/carts.factory'
import { CategoriesFactory } from './factories/categories.factory'
import { PicturesFactory } from './factories/pictures.factory'
import { ProductCartsFactory } from './factories/productCarts.factory'
import { ProductReferencesFactory } from './factories/productReferences.factory'
import { RolesFactory } from './factories/roles.factory'
import { StocksFactory } from './factories/stocks.factory'
import { UsersFactory } from './factories/users.factory'

// Change OPTIONS in dataSource
import { OrdersFactory } from './factories/orders.factory'
import { OrdersStocksFactory } from './factories/orderstocks.factory'
(dataSource.options as any).host = process.env.DB_HOST_LOCAL
;(dataSource.options as any).port = process.env.DB_PORT_LOCAL

// Add seeding OPTIONS to dataSource
;(dataSource.options as any).factories = [
  CartsFactory,
  CategoriesFactory,
  PicturesFactory,
  ProductCartsFactory,
  ProductReferencesFactory,
  RolesFactory,
  StocksFactory,
  UsersFactory,
  OrdersFactory,
  OrdersStocksFactory
]
;(dataSource.options as any).seeds = [MainSeeder]

dataSource
  .initialize()
  .then(async () => {
    await dataSource.synchronize(true)
    await runSeeders(dataSource)
    process.exit()
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err)
  })
