import { Repository } from 'typeorm'
import { dataSource } from '../datasource'
import { Order } from '../entities/Order.entity'

export class OrderService {
  db: Repository<Order>
  constructor() {
    this.db = dataSource.getRepository(Order)
  }

  async findAll() {
    const orders = await this.db.find({
      relations: {
        user: true,
        orderStocks: { stock: { productReference: true } },
      },
    })
    if (!orders) throw new Error('Orders not found')

    return orders
  }

  async find(id: number) {
    const order = await this.db.findOne({
      where: { id },
      relations: {
        user: true,
        orderStocks: { stock: { productReference: true } },
      },
    })
    if (!order) throw new Error('Order not found')

    return order
  }

  async findByUserId(id: number) {
    const order = await this.db.find({
      where: { user: { id } },
      relations: {
        user: true,
        orderStocks: { stock: { productReference: true } },
      },
    })
    if (!order) throw new Error('Order not found')

    return order
  }
}
