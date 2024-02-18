import { MyContextMock } from './../types/MyContextMock'
import { config } from 'dotenv'
config({ path: '.env.test' })

import { describe, it, expect, beforeAll } from '@jest/globals'
import { getSchema } from '../../src/schema'
import { GraphQLSchema, graphql, print } from 'graphql'
import { DataSource } from 'typeorm'
import { mutationUserCreate } from './graphql/mutationUserCreate'
import { mutationUserLogin } from './graphql/mutationUserLogin'
import { serialize, parse } from 'cookie'
import { queryMe } from './graphql/queryMe'
import { User } from '../../src/entities/User'
import { Category } from '../../src/entities/Category'
import { Role } from '../../src/entities/Role'
import { Picture } from '../../src/entities/Picture'
import { VerificationCode } from '../../src/entities/VerificationCode'

function mockContext(renthub_token?: string) {
  const value: { context: MyContextMock; renthub_token?: string } = {
    renthub_token,
    context: {
      req: {
        headers: {
          cookie: renthub_token
            ? serialize('renthub_token', renthub_token)
            : undefined,
        },
        connection: { encrypted: false },
      },
      res: {
        getHeader: () => '',
        setHeader: (key: string, cookieValue: string | string[]) => {
          const parseValue = parse(
            Array.isArray(cookieValue) ? cookieValue[0] : cookieValue
          )
          if (parseValue.renthub_token) {
            value.renthub_token = parseValue.renthub_token
          }
        },
        headers: {},
      },
    },
  }
  return value
}

let schema: GraphQLSchema
let dataSource: DataSource
let renthub_token: string | undefined

beforeAll(async () => {
  console.log(`${__dirname}/../../../src/entities/*.ts`)
  schema = await getSchema()
  dataSource = new DataSource({
    port: Number(process.env.DB_PORT_EXT),
    host: process.env.DB_HOST,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    type: 'postgres',
    entities: [Category, Picture, Role, User, VerificationCode],
    synchronize: true,
    logging: process.env.DOCKER_LOGS ? true : false,
    dropSchema: true,
    // port: 15434,
    // host: 'localhost',
    // username: 'postgres',
    // password: 'r541bCPpxFwBBZB8',
    // database: 'postgres',
    // type: 'postgres',
    // entities: [Category, Picture, Role, User, VerificationCode],
    // synchronize: true,
    // logging: true,
    // dropSchema: true,
  })
  console.log('dataSource', dataSource)
  await dataSource.initialize()
})

describe('Category Resolvers', () => {
  it('should be ', () => {
    // const falsy = false
    expect(true).toBe(true)
  })
})

describe('TEST => users resolvers', () => {
  it('should create new User', async () => {
    const mock = mockContext()
    const result = (await graphql({
      schema,
      source: print(mutationUserCreate), // print() is used to convert the gql string to a string
      variableValues: {
        data: {
          email: 'contact@renthub.shop',
          password: 'r541bCPpxFwBBZB8',
        },
      },
      contextValue: mock.context,
    })) as any
    expect(result?.data?.userCreate?.id).toBe('1')
    const user = await User.findOneBy({ id: result?.data?.userCreate?.id })
    expect(!!user).toBeTruthy()
    expect(user?.email).toBe('contact@renthub.shop')
  })
  it('should connect a User', async () => {
    const mock = mockContext()
    const result = (await graphql({
      schema,
      source: print(mutationUserLogin), // print() is used to convert the gql string to a string
      variableValues: {
        data: {
          email: 'contact@renthub.shop',
          password: 'r541bCPpxFwBBZB8',
        },
      },
      contextValue: mock.context,
    })) as any
    expect(result?.data?.userLogin?.id).toBe('1')
    expect(!!mock.renthub_token).toBeTruthy()
    renthub_token = mock.renthub_token
  })
  it('should return null if NOT connected', async () => {
    const mock = mockContext()
    const result = (await graphql({
      schema,
      source: print(queryMe), // print() is used to convert the gql string to a string
      contextValue: mock.context,
    })) as any
    expect(result?.data).toBeNull()
  })
  it('should return user if connected', async () => {
    const mock = mockContext(renthub_token)
    const result = (await graphql({
      schema,
      source: print(queryMe), // print() is used to convert the gql string to a string
      contextValue: mock.context,
    })) as any
    expect(!!result?.data?.me?.id).toBeTruthy()
    expect(!!result?.data?.me?.email).toBeTruthy()
  })
})
