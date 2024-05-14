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
    const listCart = this.db.find({
      relations: ['owner'],
    })
    return listCart
  }

  async find(id: number) {
    const cartCart = await this.db.findOne({
      where: { id },
      relations: ['owner'],
    })
    if (!cartCart) {
      throw new Error('Cart not found')
    }
    return cartCart
  }

  async update(id: number, data: CartUpdateInput) {
    const cart = await this.db.findOne({
      where: { id },
      relations: { owner: true },
    })

    if (!cart) throw new Error('Cart not found')

    Object.assign(cart, data)

    const errors = await validate(cart)
    if (errors.length > 0) throw new Error(`Validation failed! ${errors}`)

    const updatedCart = await this.db.save(cart)
    return updatedCart
  }
}
