import { Repository } from 'typeorm'
import { validate } from 'class-validator'
import { dataSource } from '../datasource'
import { Cart, CartUpdateInput } from '../entities/Cart.entity'
import { isRightUser } from '../utils/utils'
import { MyContext } from '../types/Context.type'

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

  // @TODO: Verif if user in context is the same user to update
  async update(id: number, data: CartUpdateInput, context: MyContext) {
    const errors = await validate(data)
    if (errors.length > 0) throw new Error(`Validation failed! ${errors}`)

    const cart = await this.db.findOne({
      where: { id },
      relations: { owner: true },
    })
    if (!cart) throw new Error('Cart not found')
    // CHECK IF USER IS THE OWNER OF THE CART
    const rightUser = isRightUser(cart.owner.id, context as MyContext)

    !rightUser && new Error('You are not allowed to update this cart')

    Object.assign(cart, data)

    const updatedCart = await this.db.save(cart)
    return updatedCart
  }
}
