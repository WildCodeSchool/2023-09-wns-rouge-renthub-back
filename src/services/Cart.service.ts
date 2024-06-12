import { Repository } from 'typeorm'
import { dataSource } from '../datasource'
import { Cart } from '../entities/Cart.entity'
import { calculateDaysBetweenDates } from '../utils/utils'

export class CartService {
  db: Repository<Cart>
  constructor() {
    this.db = dataSource.getRepository(Cart)
  }

  public static calculateTotalPrice(cart: Cart) {
    let totalPrice = 0

    for (const productCart of cart.productCart) {
      const daysCount = calculateDaysBetweenDates(
        productCart.dateTimeStart,
        productCart.dateTimeEnd
      )
      totalPrice +=
        productCart.quantity * productCart.productReference.price * daysCount
    }

    return totalPrice
  }

  async find(id: number) {
    const cart = await this.db.findOne({
      where: { id },
      relations: {
        owner: true,
        productCart: { productReference: { category: true } },
      },
    })
    if (!cart) throw new Error('Cart not found')

    const totalPrice = CartService.calculateTotalPrice(cart)
    if (cart.totalPrice != totalPrice) {
      cart.totalPrice = totalPrice
      await cart.save()
    }
    return cart
  }
}
