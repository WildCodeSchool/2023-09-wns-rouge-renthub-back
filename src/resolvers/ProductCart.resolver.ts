import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql'

import {
  ProductCart,
  ProductCartCreateInput,
  ProductCartUpdateInput,
} from '../entities/ProductCart.entity'
import { ProductCartService } from '../services/ProductCart.service'
// import { isRightUser, isRightUser, isRightUser } from '../utils/utils'
import { MyContext } from '../types/Context.type'

@Resolver(() => ProductCart)
export class ProductCartResolver {
  @Authorized('ADMIN', 'USER')
  @Query(() => [ProductCart])
  async findAllProductCarts(): Promise<ProductCart[]> {
    const productCarts = await new ProductCartService().findAll()
    return productCarts
  }

  @Authorized('ADMIN', 'USER')
  @Query(() => ProductCart)
  async findProductCart(@Arg('id', () => ID) id: number) {
    const cart = await new ProductCartService().find(+id)
    return cart
  }

  @Authorized('ADMIN', 'USER')
  @Mutation(() => ProductCart)
  async createProductCart(
    @Arg('data') data: ProductCartCreateInput
  ): Promise<ProductCart> {
    const newProductCart = await new ProductCartService().create(data)
    return newProductCart
  }
  @Authorized('ADMIN', 'USER')
  @Mutation(() => ProductCart)
  async updateProductCart(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: ProductCartUpdateInput,
    @Ctx() context: MyContext
  ): Promise<ProductCart> {
    const updatedProductCart = await new ProductCartService().update(
      id,
      data,
      context
    )
    return updatedProductCart
  }
  @Authorized('ADMIN', 'USER')
  @Mutation(() => ProductCart)
  async deleteProductCart(
    @Arg('id', () => Int) id: number
  ): Promise<ProductCart> {
    const newProductCart = await new ProductCartService().delete(id)
    return newProductCart
  }
}
