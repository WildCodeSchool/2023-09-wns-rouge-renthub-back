import { Arg, ID, Int, Mutation, Query, Resolver } from 'type-graphql'

import {
  ProductCart,
  ProductCartCreateInput,
  ProductCartUpdateInput,
} from '../entities/ProductCart.entity'
import { ProductCartService } from '../services/ProductCart.service'

@Resolver(() => ProductCart)
export class ProductCartResolver {
  @Query(() => [ProductCart])
  async findAllProductCarts(): Promise<ProductCart[]> {
    const productCarts = await new ProductCartService().findAll()
    return productCarts
  }

  @Query(() => ProductCart)
  async findProductCart(@Arg('id', () => ID) id: number) {
    const cart = await new ProductCartService().find(+id)
    return cart
  }

  @Mutation(() => ProductCart)
  async createProductCart(
    @Arg('data') data: ProductCartCreateInput
  ): Promise<ProductCart> {
    const newProductCart = await new ProductCartService().create(data)
    return newProductCart
  }
  
  @Mutation(() => ProductCart)
  async updateProductCart(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: ProductCartUpdateInput
  ): Promise<ProductCart> {
    const updatedProductCart = await new ProductCartService().update(id, data)
    return updatedProductCart
  }

  @Mutation(() => ProductCart)
  async deleteProductCart(
    @Arg('id', () => Int) id: number
  ): Promise<ProductCart> {
    const newProductCart = await new ProductCartService().delete(id)
    return newProductCart
  }
}
