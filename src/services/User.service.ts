import { Repository } from 'typeorm'
import { validate } from 'class-validator'
// import jwt from 'jsonwebtoken'
import * as argon2 from 'argon2'
import { dataSource } from '../datasource'
import { Role } from '../entities/Role.entity'
import { User, UserCreateInput, UserUpdateInput } from '../entities/User.entity'
import { formatValidationErrors, generateSecurityCode } from '../utils/utils'
import { Cart } from '../entities/Cart.entity'
import { VerificationCode } from '../entities/VerificationCode.entity'
import { typeCodeVerification } from '../utils/constant'
import { sendVerificationEmail } from '../utils/mailServices/verificationEmail'
import { deletePicture } from '../utils/pictureServices/pictureServices'
import { Picture } from '../entities/Picture.entity'

// ******************************* //
// THIS SERVICE CAN BE USED
// TO DELOCALIZE LOGIC
// TO LIGHTEN THE RESOLVERS //
// ******************************* //

/**
 * Retrieves or creates a user role with the right 'USER'.
 * If the role does not exist, it creates a new role with the name 'USERS' and the right 'USER'.
 * @returns A Promise that resolves to the user role.
 */
export async function getOrCreateUserRole(): Promise<Role> {
  let role: Role | null = await Role.findOne({ where: { right: 'USER' } })
  if (!role) {
    role = new Role()
    role.name = 'USERS'
    role.right = 'USER'
    await role.save()
  }
  return role
}

export class UserService {
  db: Repository<User>
  constructor() {
    this.db = dataSource.getRepository(User)
  }

  async findAll() {
    const users = await this.db.find({
      relations: {
        cart: {
          productCarts: {
            productReference: { category: { parentCategory: true } },
          },
        },
        role: true,
        picture: true,
        createdBy: true,
        updatedBy: true,
      },
    })
    return users
  }

  async find(id: number) {
    const user = await this.db.findOne({
      where: { id },
      relations: {
        cart: {
          productCarts: {
            productReference: { category: { parentCategory: true } },
          },
        },
        role: true,
        picture: true,
      },
    })
    if (!user) throw new Error('User not found')
    return user
  }

  async create(data: UserCreateInput) {
    // Validate input data before creating User entity
    const existingUser = await this.db.findOne({ where: { email: data.email } })
    if (existingUser) throw new Error('User already exists')

    const user = new User()
    Object.assign(user, data)

    const inputsDataErrors = await validate(user)
    if (inputsDataErrors.length > 0) {
      const validationMessages = formatValidationErrors(inputsDataErrors)
      if (validationMessages) throw new Error(validationMessages)
    }

    try {
      user.hashedPassword = await argon2.hash(data.password)
    } catch (error) {
      throw new Error(`Error hashing password: ${error}`)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...dataWithoutPassword } = data // delete user's original password from data
    const role = await getOrCreateUserRole()

    Object.assign(user, dataWithoutPassword, {
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      createdBy: user,
      role: role,
    })

    // creation of a brand new Cart for a new User
    const newCart = new Cart()
    user.cart = newCart

    // validation errors for User
    const errorsNewUser = await validate(user)
    if (errorsNewUser.length > 0) {
      const validationMessages = formatValidationErrors(errorsNewUser)
      if (validationMessages) throw new Error(validationMessages)
    }

    await user.save()

    const verificationCodeLength = 8
    const verificationCode = generateSecurityCode(verificationCodeLength)

    const emailVerificationCode = new VerificationCode()
    emailVerificationCode.code = verificationCode
    emailVerificationCode.type = typeCodeVerification
    emailVerificationCode.expirationDate = new Date(
      Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    )
    emailVerificationCode.user = user

    await emailVerificationCode.save()
    await sendVerificationEmail(user.id, user.email, verificationCode)

    return user
  }

  async update(id: number, data: UserUpdateInput) {
    const user = await this.db.findOne({
      where: { id },
      relations: { picture: true, role: true, cart: true },
    })
    if (!user) throw new Error('User not found')

    let oldPictureId: number | null = null
    if (data.pictureId && user.picture?.id) {
      oldPictureId = user.picture.id
      const newPicture = await Picture.findOne({
        where: { id: data.pictureId },
      })
      if (!newPicture) throw new Error('New picture not found')
      user.picture = newPicture
    }

    Object.assign(user, data)

    const errors = await validate(user)
    if (errors.length > 0) {
      const validationMessages = formatValidationErrors(errors)
      if (validationMessages) throw new Error(validationMessages)
    }

    const newUser = await User.save(user)

    if (oldPictureId) {
      await deletePicture(oldPictureId)
    }

    return newUser
  }

  async delete(id: number) {
    const user = await User.findOne({
      where: { id },
      relations: {
        picture: true,
        role: true,
        cart: true,
      },
    })
    if (!user) throw new Error('User not found')

    const pictureId = user.picture?.id

    await user.remove()
    if (pictureId) {
      await deletePicture(pictureId)
    }

    Object.assign(user, { id })
    return user
  }

  static async validatePassword(
    password: string,
    email: string
  ): Promise<void> {
    const userInput = new UserCreateInput()
    userInput.password = password
    userInput.email = email
    const errors = await validate(userInput)
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`)
    }
  }

  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const hashedPassword = await argon2.hash(password)
    return hashedPassword
  }
}
