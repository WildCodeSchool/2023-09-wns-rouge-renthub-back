import { SeederFactoryManager } from 'typeorm-extension'
import { Order, StatusEnum } from '../../../entities/Order.entity'
import { User } from '../../../entities/User.entity'
import { Stock } from '../../../entities/Stock.entity'
import { OrderStock } from '../../../entities/OrderStock.entity'
import { generateRandomDateTimeRange, getRandomInt } from './helpers'

export type OrdersSeederTypes = {
  ordersSaved: Order[]
  orderStocksSaved: OrderStock[]
}

export default async function orderSeeder(
  users: User[],
  stocksSaved: Stock[],
  factoryManager: SeederFactoryManager
): Promise<OrdersSeederTypes> {
  const ordersSaved: Order[] = []
  const orderStocksSaved: OrderStock[] = []

  const randomOrdersCount = getRandomInt(0, users.length * 2)
  for (let i = 0; i < randomOrdersCount; i++) {
    const { dateTimeStart, dateTimeEnd } = generateRandomDateTimeRange()

    const newOrder = await createOrder(users, factoryManager)
    const orderSaved = await newOrder.save()
    ordersSaved.push(orderSaved)

    for (const stock of stocksSaved) {
      if (Math.random() < 0.7) continue

      let isAvailable = true
      const orderStocksById = orderStocksSaved.filter((orderStock) => {
        return orderStock.stock.id === stock.id
      })

      for (const orderStockSaved of orderStocksById) {
        if (
          !(
            dateTimeEnd <= orderStockSaved.dateTimeStart ||
            dateTimeStart >= orderStockSaved.dateTimeEnd
          )
        ) {
          isAvailable = false
          break
        }
      }
      if (isAvailable) {
        const orderStockMenager = factoryManager.get(OrderStock)
        const orderStock = await orderStockMenager.make()
        orderStock.dateTimeStart = dateTimeStart
        orderStock.dateTimeEnd = dateTimeEnd
        orderStock.stock = stock

        orderStock.order = orderSaved
        const newOrderStock = await orderStock.save()
        orderStocksSaved.push(newOrderStock)
      } else break
    }
  }

  return { ordersSaved, orderStocksSaved }
}

async function createOrder(
  users: User[],
  factoryManager: SeederFactoryManager
): Promise<Order> {
  const orderMenager = factoryManager.get(Order)
  const newOrder = await orderMenager.make()
  newOrder.user = users[Math.floor(Math.random() * users.length)]
  const random = getRandomInt(0, 20)
  newOrder.status =
    random < 8
      ? StatusEnum.INPROGRESS
      : random < 12
        ? StatusEnum.CANCEL
        : StatusEnum.DONE
  return newOrder
}
