import { Repository } from 'typeorm'
import { validate } from 'class-validator'
import { dataSource } from '../datasource'
import { Cart, CartUpdateInput } from '../entities/Cart.entity'
import { User } from '../entities/User'

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

  async create(owner: User) {
    const newCart = this.db.create()
    newCart.owner = owner
    const newCartSave = await this.db.save(newCart)
    return newCartSave
  }

  async update(data: CartUpdateInput) {
    const errors = await validate(data)
    if (errors.length > 0) {
      throw new Error('Validation failed!')
    }

    const cartCart = await this.db.findOne({
      where: { id: 1 },
      relations: ['productReference'],
    })

    if (!cartCart) {
      throw new Error('Cart not found')
    }

    const updatedCart = await this.db.save(cartCart)
    return updatedCart
  }

  async delete(id: number) {
    const cartCart = await this.db.findOne({
      where: { id },
      relations: ['productReference'],
    })
    if (!cartCart) {
      throw new Error("Cart doesn't exist")
    }

    this.db.remove(cartCart)
    return true
  }
}
