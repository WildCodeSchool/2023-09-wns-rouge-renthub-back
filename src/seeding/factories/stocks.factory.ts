import { Faker } from '@faker-js/faker'
import { setSeederFactory } from 'typeorm-extension'
import { Stock } from '../../entities/Stock.entity'

export const StocksFactory = setSeederFactory(Stock, (faker: Faker) => {
  const stock = new Stock()
  stock.name = faker.color.human() + ' ' + faker.lorem.word(2).toUpperCase()
  stock.serialNumber = 'SN_' + faker.string.uuid()
  stock.purchaseDataTime = faker.date.past()
  return stock
})
