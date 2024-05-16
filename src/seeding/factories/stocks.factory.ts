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

/*
    "name": "stock 2 name for MacBook 14",
    "isAvailable": true,
    "serialNumber": "MB-14-2",
    "purchaseDataTime": "2024-05-17T16:24:57.200Z",
    "supplier": "Apple.com",
    "sku": "sku 1",
    "productReference": {
      "id": "1"
    }
*/
