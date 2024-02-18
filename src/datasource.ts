import { config } from 'dotenv'
config({ path: '.env.test' })
import { DataSource } from 'typeorm'

import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

// export const dataSourceOptions: PostgresConnectionOptions = {
//   type: 'postgres',
//   entities: [`${__dirname}/entities/*.ts`],
//   synchronize: true,
//   username: process.env.POSTGRES_USER,
//   password: process.env.POSTGRES_PASSWORD,
//   database: process.env.POSTGRES_DB,
//   logging: process.env.DOCKER_LOGS === 'true' ? true : false,
// }

const dataSourceOptions: PostgresConnectionOptions = {
  type: 'postgres',
  entities: [`${__dirname}/entities/*.ts`],
  synchronize: true,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  logging: process.env.DOCKER_LOGS === 'true' ? true : false,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  migrations: [`${__dirname}/../migrations/*.ts`],
}

export const dataSourceOptionsExt: PostgresConnectionOptions = {
  ...dataSourceOptions,
  port: Number(process.env.DB_PORT_EXT),
  host: '127.0.0.1',
}

export const dataSource = new DataSource(dataSourceOptions)
