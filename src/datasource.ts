import { DataSource } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

export const dataSourceOptions: PostgresConnectionOptions = {
  type: 'postgres',
  entities: [`${__dirname}/entities/*.ts`],
  synchronize: true,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  logging: process.env.DOCKER_LOGS === 'true' ? true : false,
}

export const dataSource = new DataSource({
  ...dataSourceOptions,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
})
