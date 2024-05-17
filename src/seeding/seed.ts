import 'reflect-metadata'
import { DataSource, DataSourceOptions } from 'typeorm'
import { runSeeders, SeederOptions } from 'typeorm-extension'

import MainSeeder from './main.seeder'
import { CartsFactory } from './factories/carts.factory'
import { CategoriesFactory } from './factories/categories.factory'
import { PicturesFactory } from './factories/pictures.factory'
import { PictureProductsFactory } from './factories/pictureProducts.factory'
import { ProductCartsFactory } from './factories/productCarts.factory'
import { ProductReferencesFactory } from './factories/productReferences.factory'
import { RolesFactory } from './factories/roles.factory'
import { StocksFactory } from './factories/stocks.factory'
import { UsersFactory } from './factories/users.factory'

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  // host: process.env.DB_HOST_LOCAL,
  host: '127.0.0.1',
  port: 5434,
  username: 'postgres',
  password: 'r541bCPpxFwBBZB8',
  database: 'renthub',
  entities: [`${__dirname}/factories/*.ts`],
  factories: [
    CartsFactory,
    CategoriesFactory,
    PicturesFactory,
    PictureProductsFactory,
    ProductCartsFactory,
    ProductReferencesFactory,
    RolesFactory,
    StocksFactory,
    UsersFactory,
  ],
  seeds: [MainSeeder],
}
const dataSource = new DataSource(options)

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
