import { Arg, Authorized, ID, Mutation, Query, Resolver } from 'type-graphql'
import {
  ProductReference,
  ProductReferenceCreateInput,
  ProductReferenceUpdateInput,
} from '../entities/ProductReference.entity'
import { ProductReferenceService } from '../services/ProductReference.service'

@Resolver(() => ProductReference)
export class ProductReferenceResolver {
  @Authorized('ADMIN')
  @Mutation(() => ProductReference)
  async createProductReference(
    @Arg('data') data: ProductReferenceCreateInput
  ): Promise<ProductReference> {
    const newProductReference = new ProductReferenceService().create(data)
    return newProductReference
  }

  @Query(() => [ProductReference])
  async getProductsReferences(): Promise<ProductReference[]> {
    const productReferences = await new ProductReferenceService().findAll()
    return productReferences
  }

  @Query(() => ProductReference)
  async getProductReference(@Arg('id', () => ID) id: number) {
    const productReference = await new ProductReferenceService().find(id)

    return productReference
  }

  @Authorized('ADMIN')
  @Mutation(() => ProductReference)
  async updateProductReference(
    @Arg('id', () => ID) id: number,
    @Arg('data') data: ProductReferenceUpdateInput
  ) {
    const updatedProductReference = await new ProductReferenceService().update(
      id,
      data
    )
    return updatedProductReference
  }

  @Authorized('ADMIN')
  @Mutation(() => ProductReference)
  async deleteProductReference(@Arg('id', () => ID) id: number) {
    const deletedProductReference = await new ProductReferenceService().delete(
      id
    )
    return deletedProductReference
  }
}
