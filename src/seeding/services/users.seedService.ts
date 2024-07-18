import { SeederFactoryManager } from 'typeorm-extension'
import { Role } from '../../entities/Role.entity'
import { Cart } from '../../entities/Cart.entity'
import { User } from '../../entities/User.entity'

export type UsersSeederTypes = {
  usersSaved: User[]
  cartsSaved: Cart[]
}

export default async function usersSeeder(
  roles: Role[],
  numberOfUsers: number = 5,
  factoryManager: SeederFactoryManager
) {
  const cartsSaved: Cart[] = []
  const usersSaved: User[] = []

  const cartFactory = factoryManager.get(Cart)
  const userFactory = factoryManager.get(User)

  const devsAccounts = [
    {
      firstname: 'Hugo',
      lastname: 'SuperDev',
      nickname: 'Huhu',
      email: 'hugo@dev.com',
      //password: Azerty@123
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$jTqXIhRXrLmgpBknU6HtYA$eTwliyGdxEgF4pYEQq/r1TYE9nQEVAvSbw6OeAAMlpc',
    },
    {
      firstname: 'Tom',
      lastname: 'SuperDev',
      nickname: 'Toto',
      email: 'tom@dev.com',
      //password: Azerty@123
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$jTqXIhRXrLmgpBknU6HtYA$eTwliyGdxEgF4pYEQq/r1TYE9nQEVAvSbw6OeAAMlpc',
    },
    {
      firstname: 'Victor',
      lastname: 'SuperDev',
      nickname: 'Vivi',
      email: 'victor@dev.com',
      //password: Azerty@123
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$jTqXIhRXrLmgpBknU6HtYA$eTwliyGdxEgF4pYEQq/r1TYE9nQEVAvSbw6OeAAMlpc',
    },
    {
      firstname: 'Jonathan',
      lastname: 'SuperDev',
      nickname: 'Jojo',
      email: 'jonathan@dev.com',
      //password: Azerty@123
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$jTqXIhRXrLmgpBknU6HtYA$eTwliyGdxEgF4pYEQq/r1TYE9nQEVAvSbw6OeAAMlpc',
    },
    {
      firstname: 'Lukasz',
      lastname: 'SuperDev',
      nickname: 'Lulu',
      email: 'zed11temp@gmail.com',
      //password: Azerty@123
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$jTqXIhRXrLmgpBknU6HtYA$eTwliyGdxEgF4pYEQq/r1TYE9nQEVAvSbw6OeAAMlpc',
    },
  ]
  const countDevs = devsAccounts.length

  const users = await userFactory.saveMany(countDevs + numberOfUsers || 0)
  users.sort((a, b) => a.id - b.id)
  const carts = await cartFactory.saveMany(countDevs + numberOfUsers || 0)
  carts.sort((a, b) => a.id - b.id)

  for (let i = 0; i < users.length; i++) {
    const user = users[i]

    if (i < countDevs) {
      user.firstName = devsAccounts[i].firstname
      user.lastName = devsAccounts[i].lastname
      user.nickName = devsAccounts[i].nickname
      user.email = devsAccounts[i].email
      user.role = roles[0]
    } else {
      user.role = roles[1]
    }

    user.cart = carts[i]
    carts[i].owner = user
    cartsSaved.push(carts[i])

    const userSaved = await user.save()

    usersSaved.push(userSaved)
  }

  return { usersSaved, cartsSaved }
}
