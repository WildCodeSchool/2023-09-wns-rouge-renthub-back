import { Arg, Mutation, Resolver } from 'type-graphql'
import { User } from '../entities/User'
import { VerificationCode } from '../entities/VerificationCode'
import { sendVerificationEmail } from '../utils/mailServices/verificationEmail'
import { generateSecurityCode } from '../utils/utils'
import { typeCodeVerification } from '../utils/constant'

@Resolver(VerificationCode)
export class VerificationCodeResolver {
  @Mutation(() => Boolean)
  async generateNewVerificationCode(
    @Arg('userId') userId: number
  ): Promise<boolean> {
    try {
      const user = await User.findOneBy({ id: userId })
      if (!user) {
        throw new Error('Utilisateur non trouvé')
      }
      const verificationCodeLength = 8
      const newCode = generateSecurityCode(verificationCodeLength)
      let verificationCode = await VerificationCode.findOneBy({
        user: { id: userId },
        type: typeCodeVerification,
      })
      if (verificationCode) {
        verificationCode.code = newCode
        verificationCode.expirationDate = new Date(
          Date.now() + 24 * 60 * 60 * 1000
        )
        verificationCode.maximumTry = 0
      } else {
        verificationCode = VerificationCode.create({
          user,
          code: newCode,
          type: typeCodeVerification,
          expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          maximumTry: 0,
        })
      }

      await verificationCode.save()

      await sendVerificationEmail(user.id, user.email, newCode)

      return true
    } catch (error) {
      return false
    }
  }
}
