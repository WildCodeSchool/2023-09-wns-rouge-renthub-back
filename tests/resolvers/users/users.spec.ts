import { config } from 'dotenv'
config()
import { describe, it, expect, beforeAll } from '@jest/globals'
import { getSchema } from '../../../src/schema'
import { GraphQLSchema, graphql, print } from 'graphql'
import { dataSource } from '../../../src/datasource'
import { mutationUserCreate } from './graphql/mutationUserCreate'
import { mutationUserLogin } from './graphql/mutationUserLogin'
import { User } from '../../../src/entities/User.entity'
import { serialize, parse } from 'cookie'
import { queryMe } from './graphql/queryMe'
import { mutationVerifyEmail } from './graphql/mutationVerifyEmail'
import { VerificationCode } from '../../../src/entities/VerificationCode.entity'

function mockContext(renthub_token?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: { context: any; renthub_token?: string } = {
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

//GLOBAL varibles for User test
let schema: GraphQLSchema
let renthub_token: string | undefined
const email = 'example@gmail.com'
const password = 'Azerty@123'
const nickName = 'testNickName'

beforeAll(async () => {
  schema = await getSchema()

  // Change OPTIONS in dataSource
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(dataSource.options as any).host = process.env.DB_HOST_LOCAL
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(dataSource.options as any).port = process.env.DB_PORT_LOCAL
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(dataSource.options as any).dropSchema = true

  await dataSource.initialize()
})

describe('TEST => users resolvers', () => {
  it('should create new User with new Cart associated', async () => {
    const mock = mockContext()
    const result = (await graphql({
      schema,
      source: print(mutationUserCreate), // print() is used to convert the gql string to a string
      variableValues: {
        data: {
          email,
          password,
          nickName,
        },
      },
      contextValue: mock.context,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any

    const id = result?.data?.userCreate?.id
    expect(id).toBe('1')

    const user = await User.findOne({
      where: { id },
      relations: ['cart'],
    })

    expect(!!user).toBeTruthy()
    expect(user?.nickName).toBe(nickName)
    expect(user?.email).toBe(email)
    expect(user?.cart?.id).toBe(1)
  })

  it('should verify email of new user', async () => {
    const mock = mockContext(renthub_token)
    const user = await User.findOneBy({ email })
    const verificationCode = await VerificationCode.findOneBy({
      user: { id: user?.id },
    })
    const code = verificationCode?.code

    const result = (await graphql({
      schema,
      source: print(mutationVerifyEmail), // print() is used to convert the gql string to a string
      variableValues: {
        data: {
          code,
          userId: user?.id,
        },
      },
      contextValue: mock.context,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any

    const success = result?.data?.verifyEmail?.success

    expect(success).toBe(true)
  })

  it('should connect a User with userLogin() resolver', async () => {
    const mock = mockContext()
    const result = (await graphql({
      schema,
      source: print(mutationUserLogin), // print() is used to convert the gql string to a string
      variableValues: {
        data: {
          email,
          password,
        },
      },
      contextValue: mock.context,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any

    const id = result?.data?.userLogin?.id

    expect(id).toBe('1')
    expect(!!mock.renthub_token).toBeTruthy()
    renthub_token = mock.renthub_token
  })

  it('should return null if NOT connected', async () => {
    const mock = mockContext()
    const result = (await graphql({
      schema,
      source: print(queryMe), // print() is used to convert the gql string to a string
      contextValue: mock.context,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any

    expect(result?.data).toBeNull()
  })

  it('should return user if connected(queryMe)', async () => {
    const mock = mockContext(renthub_token)
    const result = (await graphql({
      schema,
      source: print(queryMe), // print() is used to convert the gql string to a string
      contextValue: mock.context,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any

    expect(!!result?.data?.me?.id).toBeTruthy()
    expect(!!result?.data?.me?.email).toBeTruthy()
  })
})
