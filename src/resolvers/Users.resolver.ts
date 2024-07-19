import {
  Arg,
  Query,
  Resolver,
  Mutation,
  Ctx,
  ID,
  Authorized,
} from 'type-graphql'
import {
  MeUser,
  User,
  UserContext,
  UserCreateInput,
  UserLoginInput,
  UserUpdateInput,
  VerifyEmailResponse,
  VerifyEmailResponseInput,
} from '../entities/User.entity'
import * as argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { MyContext } from '../types/Context.type'
import Cookies from 'cookies'
import { sendConfirmationEmail } from '../utils/mailServices/verificationEmail'
import { isRightUser } from '../utils/utils'
import { VerificationCode } from '../entities/VerificationCode.entity'
import { typeCodeVerification } from '../utils/constant'
import { UserService } from '../services/User.service'

@Resolver(User)
export class UsersResolver {
  @Authorized('ADMIN')
  @Query(() => [User])
  async usersGetAll(): Promise<User[]> {
    const users = await new UserService().findAll()
    return users
  }

  @Authorized('ADMIN', 'USER')
  @Query(() => User, { nullable: true })
  async userGetById(
    @Ctx() context: MyContext,
    @Arg('id', () => ID) id: number
  ): Promise<User | null> {
    const isUserAuthorised = isRightUser(id, context)
    if (!isUserAuthorised)
      throw new Error('User not authorized to access this resource')

    const user = await new UserService().find(id)
    return user
  }

  @Mutation(() => User)
  async userCreate(
    @Arg('data', () => UserCreateInput) data: UserCreateInput
  ): Promise<User> {
    const newUser = new UserService().create(data)
    return newUser
  }

  @Mutation(() => VerifyEmailResponse)
  async verifyEmail(
    @Arg('data', () => VerifyEmailResponseInput) data: VerifyEmailResponseInput
  ): Promise<VerifyEmailResponse> {
    try {
      /* Get the user */
      const user = await User.findOneBy({ id: data.userId })
      if (!user) {
        return { success: false, message: 'User not found' }
      }
      /* Check if code arg is equal to verificationCode.code */
      const verificationCode = await VerificationCode.findOneBy({
        user: { id: user.id },
        type: typeCodeVerification,
      })

      if (!verificationCode) {
        throw new Error('Verification code not found')
      }
      /* Check if code is expired */
      const now = new Date()
      if (verificationCode.expirationDate < now) {
        throw new Error('Verification code expired')
      }
      /* Check if maximumTry is greater than 3 */
      if (verificationCode.maximumTry == 3) {
        throw new Error('Max tries exceeded')
      }
      /* Incremente maximumTry when user write wrong code */
      if (verificationCode.code !== data.code) {
        verificationCode.maximumTry++
        await verificationCode.save()
        return { success: false, message: 'Invalid verification code' }
      }

      user.isVerified = true
      await user.save()

      await verificationCode.remove()

      await sendConfirmationEmail(user.email, user.firstName)

      return { success: true, message: 'Email verified successfully !' }
    } catch (error) {
      return {
        success: false,
        message: `Error occured : ${error}`,
      }
    }
  }

  // @TODO : Add date of last connection //
  @Mutation(() => User)
  async userLogin(
    @Ctx() context: MyContext,
    @Arg('data', () => UserLoginInput) data: UserLoginInput
  ) {
    const user = await User.findOne({
      where: { email: data.email },
      relations: { role: true },
    })
    if (!user) {
      throw new Error('Email ou mot de passe incorrect')
    }
    if (!user.isVerified) {
      throw new Error('Email non vérifié, consultez votre boite mail')
    }
    const valid = await argon2.verify(user.hashedPassword, data.password)
    if (!valid) {
      throw new Error('Email ou mot de passe incorrect')
    }

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() + 4 * 60 * 60 * 1000),
        userId: user.id,
      },
      process.env.JWT_SECRET_KEY || ''
    )

    const cookie = new Cookies(context.req, context.res)

    cookie.set('renthub_token', token, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + 4 * 60 * 60 * 1000),
    })
    return user
  }
  // THIS RESOLVER IS ONLY USED TO VERIFY THAT A USER IS CONNECTED & HIS ROLE //
  @Query(() => UserContext, { nullable: true })
  async meContext(@Ctx() context: MyContext): Promise<UserContext | null> {
    // Get if cookie is present in context
    const cookies = new Cookies(context.req, context.res)
    const renthub_token = cookies.get('renthub_token')

    if (!renthub_token) {
      return null
    }

    try {
      // Verify token
      const payload = jwt.verify(
        renthub_token,
        process.env.JWT_SECRET_KEY || ''
      )
      // Get user from payload
      if (typeof payload === 'object' && 'userId' in payload) {
        const user = await User.findOne({
          where: { id: payload.userId },
          relations: {
            role: true,
          },
        })
        // if user is found, return user context
        if (user) {
          const userContext = {
            lastName: user.lastName,
            firstName: user.firstName,
            role: user.role.right,
          }
          return userContext
        } else {
          return null
        }
      }
    } catch (err) {
      console.error('Error verifying token:', err)
      return null
    }

    return null
  }

  // THIS RESOLVER IS USED TO RETRIEVE A COMPLETE SET OF INFORMATION ABOUT THE CURRENTLY LOGGED IN USER //
  @Authorized('ADMIN', 'USER')
  @Query(() => MeUser)
  async me(@Ctx() context: MyContext): Promise<MeUser | null> {
    if (!context.user) {
      throw new Error('User not found')
    }

    const meUser = {
      id: context.user?.id,
      email: context.user?.email,
      firstName: context.user?.firstName,
      lastName: context.user?.lastName,
      nickName: context.user?.nickName,
      phoneNumber: context.user?.phoneNumber,
      dateOfBirth: context.user?.dateOfBirth,
      createdBy: context.user?.createdBy,
      updatedBy: context.user?.updatedBy,
      createdAt: context.user?.createdAt,
      updatedAt: context.user?.updatedAt,
      lastConnectionDate: context.user?.lastConnectionDate,
    }

    return meUser
  }

  @Authorized('ADMIN', 'USER')
  @Mutation(() => Boolean)
  async userSignOut(@Ctx() context: MyContext): Promise<boolean> {
    const cookie = new Cookies(context.req, context.res)
    cookie.set('renthub_token', '', {
      httpOnly: true,
      secure: false,
      maxAge: 0,
    })
    return true
  }
  @Authorized('ADMIN', 'USER')
  @Mutation(() => User, { nullable: true })
  async userUpdate(
    @Ctx() context: MyContext,
    @Arg('data') data: UserUpdateInput
  ): Promise<User | null> {
    const id = context.user?.id
    if (!id) throw new Error('User not found in Context')

    const isUserAuthorised = isRightUser(id, context)
    if (!isUserAuthorised)
      throw new Error('User not authorized for this update')

    const updatedUser = await new UserService().update(id, data)

    return updatedUser
  }

  @Authorized('ADMIN', 'USER')
  @Mutation(() => User, { nullable: true })
  async userDelete(
    @Ctx() context: MyContext,
    @Arg('id', () => ID) id: number
  ): Promise<User | null> {
    const isUserAuthorised = isRightUser(id, context)
    if (!isUserAuthorised)
      throw new Error('User not authorized for this delete')

    const user = await new UserService().find(id)
    return user
  }
}
