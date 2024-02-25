import { Arg, Query, Resolver, Mutation, Ctx, ID } from 'type-graphql'
import {
  User,
  UserContext,
  UserCreateInput,
  UserLoginInput,
  UserUpdateInput,
  VerifyEmailResponse,
} from '../entities/User'
import { validate } from 'class-validator'
import * as argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { MyContext } from '../index'
import Cookies from 'cookies'
import { Picture } from '../entities/Picture'
import { deletePicture } from '../utils/pictureServices/pictureServices'
import {
  sendVerificationEmail,
  sendConfirmationEmail,
} from '../utils/mailServices/verificationEmail'
import { getUserFromReq } from '../auth'
import { generateSecurityCode } from '../utils/utils'
import { VerificationCode } from '../entities/VerificationCode'
import { typeCodeVerification } from '../utils/constant'

@Resolver(User)
export class UsersResolver {
  @Query(() => [User])
  //TODO  : delete eslint flag when context is used and function implemented correctly
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async usersGetAll(@Ctx() context: MyContext): Promise<User[]> {
    const users = await User.find()
    return users
  }

  @Mutation(() => User)
  async userCreate(
    @Ctx() context: MyContext,
    @Arg('data', () => UserCreateInput) data: UserCreateInput
  ): Promise<User> {
    // Validate input data before creating User entity
    const inputsDataErrors = await validate(data)
    if (inputsDataErrors.length > 0) {
      throw new Error(
        `Inputs data validation error : ${JSON.stringify(inputsDataErrors)}`
      )
    }

    const existingUser = await User.findOne({
      where: { email: data.email },
    })
    if (existingUser) {
      throw new Error('User already exists')
    }

    const newUser = new User();
    /* createdBy
     * newUser || adminUser
     * Depends if token is present in context.
     */
    const cookie = new Cookies(context.req, context.res)
    const token = cookie.get('renthub_token') // TODO verify JWT token name inside userLogin resolver
    let adminUser: User | null = null
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY || '')
      if (typeof payload === 'object' && 'userId' in payload) {
        const user = await User.findOne({
          where: { id: payload.userId },
          relations: {
            picture: true,
            // TODO add relations to adminUser if needed. For example Role.
          },
        })
        // TODO add extra condition : if(adminUser.role === "ADMIN" || adminUser.role === "SUPERADMIN")
        adminUser = user
      } else {
        throw new Error('Token invalid')
      }
    }

    try {
      newUser.hashedPassword = await argon2.hash(data.password)
    } catch (error) {
      throw new Error(`Error hashing password: ${error}`)
    }

    // delete user's original password from data
    const { password, ...dataWithoutPassword } = data;

    Object.assign(newUser, dataWithoutPassword, {
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      createdBy: adminUser || newUser,
    });

    const errors = await validate(newUser);
    if (errors.length === 0) {
      await newUser.save()

      const verificationCodeLength = 8
      const verificationCode = generateSecurityCode(verificationCodeLength)

      const emailVerificationCode = new VerificationCode()
      emailVerificationCode.code = verificationCode
      emailVerificationCode.type = typeCodeVerification
      emailVerificationCode.expirationDate = new Date(
        Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      )
      emailVerificationCode.user = newUser

      await emailVerificationCode.save()
      await sendVerificationEmail(newUser.id, newUser.email, verificationCode)
    }
    return newUser
  }

  @Mutation(() => VerifyEmailResponse)
  async verifyEmail(
    @Arg('userId') userId: number,
    @Arg('code') code: string
  ): Promise<VerifyEmailResponse> {
    try {
      /* Get the user */
      const user = await User.findOneBy({ id: userId })
      if (!user) {
        return { success: false, message: 'Utilisateur non trouvé' }
      }
      /* Check if code arg is equal to verificationCode.code */
      const verificationCode = await VerificationCode.findOneBy({
        user: { id: user.id },
        type: typeCodeVerification,
      })

      if (!verificationCode) {
        return {
          success: false,
          message: 'Code de vérification invalide ou expiré',
        }
      }
      /* Check if code is expired */
      const now = new Date()
      if (verificationCode.expirationDate < now) {
        return {
          success: false,
          message: 'Code de vérification expiré',
        }
      }

      /* Check if maximumTry is greater than 3 */
      if (verificationCode.maximumTry == 3) {
        return {
          success: false,
          message:
            'Nombre maximal de tentatives atteint. Un nouveau code doit être généré.',
        }
      }
      /* Incremente maximumTry when user write wrong code */
      if (verificationCode.code !== code) {
        verificationCode.maximumTry++
        await verificationCode.save()
        return { success: false, message: 'Code de vérification invalide' }
      }

      user.isVerified = true
      await user.save()

      await verificationCode.remove()

      await sendConfirmationEmail(user.email, user.nickName)

      return { success: true, message: 'Email vérifié avec succès !' }
    } catch (error) {
      return {
        success: false,
        message: "Erreur lors de la vérification de l'email.",
      }
    }
  }

  @Mutation(() => User)
  async userLogin(
    @Ctx() context: MyContext,
    @Arg('data', () => UserLoginInput) data: UserLoginInput
  ) {
    const user = await User.findOne({ where: { email: data.email } })
    if (!user) {
      throw new Error('Email ou mot de passe incorrect')
    }
    if (!user.isVerified) {
      throw new Error("Email non vérifié, consultez votre boite mail");
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

  @Query(() => UserContext)
  async meContext(@Ctx() context: MyContext): Promise<UserContext> {
    if (!context.user) {
      throw new Error('User not found')
    }
    const user = context.user as UserContext
    return user
  }

  @Query(() => User)
  async me(@Ctx() context: MyContext): Promise<User | null> {
    const user = await getUserFromReq(context.req, context.res)
    return user
  }

  @Mutation(() => Boolean)
  async userSignOut(@Ctx() context: MyContext): Promise<boolean> {
    const cookie = new Cookies(context.req, context.res)
    cookie.set('TGCookie', '', {
      httpOnly: true,
      secure: false,
      maxAge: 0,
    })
    return true
  }

  @Mutation(() => User, { nullable: true })
  async userUpdate(
    @Ctx() context: MyContext,
    @Arg('data') data: UserUpdateInput
  ): Promise<User | null> {
    const userId = context.user?.id

    const user = await User.findOne({
      where: { id: userId },
      relations: { picture: true },
    })

    if (
      user &&
      user.id === context.user?.id //  || context.user?.role
    ) {
      let oldPictureId: number | null = null
      if (data.pictureId && user.picture?.id) {
        oldPictureId = user.picture.id
        const newPicture = await Picture.findOne({
          where: { id: data.pictureId },
        })
        if (!newPicture) {
          throw new Error('New picture not found')
        }
        user.picture = newPicture
      }

      Object.assign(user, data)

      const errors = await validate(user)
      if (errors.length === 0) {
        await User.save(user)
        if (oldPictureId) {
          await deletePicture(oldPictureId)
        }

        return await User.findOne({
          where: { id: userId },
        })
      } else {
        throw new Error(`Error occured: ${JSON.stringify(errors)}`)
      }
    }
    return user
  }

  @Mutation(() => User, { nullable: true })
  async userDelete(
    @Ctx() context: MyContext,
    @Arg('id', () => ID) id: number
  ): Promise<User | null> {
    const user = await User.findOne({
      where: { id: id },
    })
    if (
      user &&
      user.id === context.user?.id //  || context.user?.role
    ) {
      const pictureId = user.picture?.id
      await user.remove()
      if (pictureId) {
        await deletePicture(pictureId)
      }
      user
    } else {
      throw new Error(`Error delete user`)
    }
    return user
  }
}
