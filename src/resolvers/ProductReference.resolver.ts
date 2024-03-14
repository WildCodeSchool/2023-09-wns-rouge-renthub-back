import { Arg, Mutation, Resolver } from 'type-graphql'
import {
  ProductReference,
  ProductReferenceCreateInput,
} from '../entities/ProductReference.entity'
import { validate } from 'class-validator'
import { Category } from '../entities/Category'

@Resolver(() => ProductReference)
export class ProductReferenceResolver {
  @Mutation(() => ProductReference)
  async createProductReference(
    @Arg('data') data: ProductReferenceCreateInput
  ): Promise<ProductReference> {
    try {
      const productReference = new ProductReference()
      const currentCategory = await Category.findOne({
        where: { id: data.category },
      })
      Object.assign(productReference, data, { category: currentCategory })
      const errors = await validate(productReference)
      if (errors.length > 0) {
        throw new Error('Validation failed!')
      }
      await productReference.save()
      return productReference
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  // @Query(() => [ProductReference])
  // async listCategories(): Promise<Category[]> {
  //   const categories = await new CategoryService().list()
  //   return categories
  // }

  // @Query(() => Category)
  // async findCategory(@Arg('id', () => ID) id: number) {
  //   const categoryById = await new CategoryService().find(+id)
  //   return categoryById
  // }

  // @Mutation(() => Category, { nullable: true })
  // async updateCategory(@Arg('data') data: CategoryUpdateInput) {
  //   const category = await new CategoryService().update(data)
  //   return category
  // }

  // @Mutation(() => Boolean, { nullable: true })
  // async deleteCategory(@Arg('id', () => ID) id: number) {
  //   const isDelete = await new CategoryService().delete(+id)
  //   return isDelete
  // }
}
