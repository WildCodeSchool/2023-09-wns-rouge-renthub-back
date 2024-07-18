import { Faker } from '@faker-js/faker'
import { setSeederFactory } from 'typeorm-extension'
import { User } from '../../entities/User.entity'

export const UsersFactory = setSeederFactory(User, (faker: Faker) => {
  const firstname = faker.person.firstName()
  const lastname = faker.person.lastName()
  const user = new User()
  user.firstName = firstname
  user.lastName = lastname
  user.email = `${firstname.toLowerCase()}.${lastname.toLowerCase()}${Math.floor(Math.random() * 1000)}@gmail.com`
  user.nickName = `${firstname.substring(0, 2)}${firstname.substring(0, 2).toLowerCase()}`
  user.phoneNumber = '06' + faker.string.numeric(8)
  user.dateOfBirth = new Date("2024-06-12T00:00:00.000Z")
  user.hashedPassword = //password: Azerty@123
    '$argon2id$v=19$m=65536,t=3,p=4$jTqXIhRXrLmgpBknU6HtYA$eTwliyGdxEgF4pYEQq/r1TYE9nQEVAvSbw6OeAAMlpc'
  user.isVerified = true
  user.lastConnectionDate = faker.date.recent()
  user.createdAt = faker.date.recent()
  user.updatedAt = faker.date.recent()
  user.createdBy = user
  user.updatedBy = user

  return user
})
