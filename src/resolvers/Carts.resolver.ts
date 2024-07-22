import { Arg, Authorized, Ctx, ID, Query, Resolver } from 'type-graphql'
import { Cart } from '../entities/Cart.entity'
import { CartService } from '../services/Cart.service'
import { MyContext } from '../types/Context.type'

@Resolver(() => Cart)
export class CartResolver {
  @Authorized('ADMIN', 'USER')
  @Query(() => Cart)
  async findCart(@Arg('id', () => ID) id: number) {
    const cart = await new CartService().find(+id)

    return cart
  }

  @Authorized('ADMIN', 'USER')
  @Query(() => Cart)
  async currentCart(@Ctx() context: MyContext) {
    const id = context.user?.cart?.id
    if (!id) throw new Error('Cart not found')
    const cart = await new CartService().find(id)

    return cart
  }
}
