import { Repository } from 'typeorm'
import { validate } from 'class-validator'
import { dataSource } from '../datasource'
import { Cart, CartUpdateInput } from '../entities/Cart.entity'

export class CartService {
  db: Repository<Cart>
  constructor() {
    this.db = dataSource.getRepository(Cart)
  }

  async findAll() {
    const carts = this.db.find({
      relations: {
        owner: true,
        productCart: { productReference: { category: true } },
      },
    })
    return carts
  }

  async find(id: number) {
    const cart = await this.db.findOne({
      where: { id },
      relations: {
        owner: true,
        productCart: { productReference: { category: true } },
      },
    })
    if (!cart) {
      throw new Error('Cart not found')
    }
    return cart
  }

  async update(id: number, data: CartUpdateInput) {
    const errors = await validate(data)
    if (errors.length > 0) throw new Error(`Validation failed! ${errors}`)

    const cart = await this.db.findOne({
      where: { id },
      relations: { owner: true },
    })
    if (!cart) throw new Error('Cart not found')

    Object.assign(cart, data)

    const updatedCart = await this.db.save(cart)
    return updatedCart
  }
}
