import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql'
import { Cart, CartUpdateInput } from '../entities/Cart.entity'
import { CartService } from '../services/Cart.service'
import { MyContext } from '../types/Context.type'

@Resolver(() => Cart)
export class CartResolver {
  @Authorized('ADMIN')
  @Query(() => [Cart])
  async findAllCarts(): Promise<Cart[]> {
    const carts = await new CartService().findAll()

    return carts
  }

  @Authorized('ADMIN', 'USER')
  @Query(() => Cart)
  async findCart(@Arg('id', () => ID) id: number) {
    const cart = await new CartService().find(+id)

    return cart
  }

  @Authorized('ADMIN', 'USER')
  @Mutation(() => Cart, { nullable: true })
  async updateCart(
    @Arg('id', () => ID) id: number,
    @Arg('data') data: CartUpdateInput,
    @Ctx() context: MyContext
  ) {
    const updatedCart = await new CartService().update(id, data, context)

    return updatedCart
  }
}
