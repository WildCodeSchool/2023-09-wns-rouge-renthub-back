import { Arg, ID, Mutation, Query, Resolver } from 'type-graphql'

import { Cart, CartUpdateInput } from '../entities/Cart.entity'
import { CartService } from '../services/Cart.service'

@Resolver(() => Cart)
export class CartResolver {
  @Query(() => [Cart])
  async findAllCarts(): Promise<Cart[]> {
    const carts = await new CartService().findAll()
    return carts
  }

  @Query(() => Cart)
  async findCart(@Arg('id', () => ID) id: number) {
    const cart = await new CartService().find(+id)
    return cart
  }

  @Mutation(() => Cart, { nullable: true })
  async updateCart(
    @Arg('id', () => ID) id: number,
    @Arg('data') data: CartUpdateInput
  ) {
    const updatedCart = await new CartService().update(id, data)
    return updatedCart
  }
}
