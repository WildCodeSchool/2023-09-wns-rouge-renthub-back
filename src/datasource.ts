import { DataSource } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

export const dataSourceOptions: PostgresConnectionOptions = {
  type: 'postgres',
  entities: [`${__dirname}/entities/*.ts`],
  subscribers: [`${__dirname}/subscribers/*.ts`],
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
