import { Repository } from 'typeorm'
import { dataSource } from '../datasource'
import { OrderStock } from '../entities/OrderStock.entity'
import { validate } from 'class-validator'
import { formatValidationErrors } from '../utils/utils'

export class OrderStockService {
  db: Repository<OrderStock>
  constructor() {
    this.db = dataSource.getRepository(OrderStock)
  }

  async create(data: OrderStock[]) {
    const orderStocks = this.db.create(data)
    const errors = await validate(orderStocks)
    if (errors.length > 0) {
      const validationMessages = formatValidationErrors(errors)
      throw new Error(validationMessages || 'Validation error occured')
    }
    await this.db.save(orderStocks)
    return orderStocks
  }

  async findAll() {
    const orderStocks = await this.db.find({
      relations: {
        order: { user: true},
        stock: { productReference: true },
      },
    })
    if (!orderStocks) throw new Error('orderStocks not found')

    return orderStocks
  }

  async find(id: number) {
    const orderStock = await this.db.findOne({
      where: { id },
      relations: {
        order: { user: true},
        stock: { productReference: true },
      },
    })
    if (!orderStock) throw new Error('orderStock not found')

    return orderStock
  }

  async deleteById(id: number) {
    const orderStock = await this.db.findOne({
      where: { id },
    })
    if (!orderStock) throw new Error("orderStock doesn't exist")

    this.db.remove(orderStock)
    return orderStock
  }
}
