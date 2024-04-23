import { Arg, Authorized, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql'

import { Cart, CartUpdateInput } from '../entities/Cart.entity'
import { CartService } from '../services/Cart.service'
import { MyContext } from '..'
import { User } from '../entities/User'

@Resolver(() => Cart)
export class CartResolver {
  @Query(() => [Cart])
  async findAllCart(): Promise<Cart[]> {
    const carts = await new CartService().findAll()
    return carts
  }

  @Query(() => Cart)
  async findCart(@Arg('id', () => ID) id: number) {
    const cart = await new CartService().find(+id)
    return cart
  }

  @Mutation(() => Cart)
  async createCart(
    owner: User
  ) {    
    const newCart = await new CartService().create(owner)
    return newCart
  }

  @Mutation(() => Cart, { nullable: true })
  async updateCart(@Arg('data') data: CartUpdateInput) {
    const cartCart = await new CartService().update(data)
    return cartCart
  }

  @Mutation(() => Boolean, { nullable: true })
  async deleteCart(@Arg('id', () => ID) id: number) {
    const isDelete = await new CartService().delete(+id)
    return isDelete
  }
}
