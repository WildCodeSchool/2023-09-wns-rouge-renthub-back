import {
  Arg,
  Authorized,
  ID,
  Query,
  Resolver,
} from 'type-graphql'
import { Cart } from '../entities/Cart.entity'
import { CartService } from '../services/Cart.service'

@Resolver(() => Cart)
export class CartResolver {
  @Authorized('ADMIN', 'USER')
  @Query(() => Cart)
  async findCart(@Arg('id', () => ID) id: number) {
    const cart = await new CartService().find(+id)

    return cart
  }
}
