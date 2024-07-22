import { DataSource } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { Cart } from './entities/Cart.entity'
import { Category } from './entities/Category.entity'
import { Picture } from './entities/Picture.entity'
import { PictureProduct } from './entities/PictureProduct.entity'
import { EntityWithDefault } from './entities/EntityWithDefault'
import { ProductCart } from './entities/ProductCart.entity'
import { ProductReference } from './entities/ProductReference.entity'
import { Role } from './entities/Role.entity'
import { Stock } from './entities/Stock.entity'
import { User } from './entities/User.entity'
import { UserToken } from './entities/UserToken.entity'
import { VerificationCode } from './entities/VerificationCode.entity'
import { ProductCartSubscriber } from './subscribers/ProductCart.subscriber'
import { ProductReferenceSubscriber } from './subscribers/ProductReference.subscriber'

export const dataSourceOptions: PostgresConnectionOptions = {
  type: 'postgres',
  entities: [
    Cart,
    Category,
    EntityWithDefault,
    Picture,
    PictureProduct,
    ProductCart,
    ProductReference,
    Role,
    Stock,
    User,
    UserToken,
    VerificationCode,
  ],
  subscribers: [ProductCartSubscriber, ProductReferenceSubscriber],
  synchronize: true,
  logging: process.env.DOCKER_LOGS === 'true' ? true : false,
}

export const dataSource = new DataSource({
  ...dataSourceOptions,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'pgpassword',
  database: process.env.POSTGRES_DB || 'renthub',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
})
