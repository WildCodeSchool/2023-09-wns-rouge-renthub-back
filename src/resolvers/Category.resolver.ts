import { CategoryService } from '../services/Category.services'
import { Arg, ID, Mutation, Query, Resolver } from 'type-graphql'
import {
  Category,
  CategoryCreateInput,
  CategoryUpdateInput,
} from '../entities/Category'

@Resolver(() => Category)
export class CategoriesResolver {
  @Query(() => [Category])
  async listCategories(): Promise<Category[]> {
    const categories = await new CategoryService().list()
    return categories
  }

  @Query(() => Category)
  async findCategory(@Arg('id', () => ID) id: number) {
    const categoryById = await new CategoryService().find(+id)
    return categoryById
  }

  @Mutation(() => Category)
  async createCategory(@Arg('data') data: CategoryCreateInput) {
    const newCategory = await new CategoryService().create(data)
    return newCategory
  }

  @Mutation(() => Category, { nullable: true })
  async updateCategory(@Arg('data') data: CategoryUpdateInput) {
    const category = await new CategoryService().update(data)
    return category
  }

  @Mutation(() => Boolean, { nullable: true })
  async deleteCategory(@Arg('id', () => ID) id: number) {
    const isDelete = await new CategoryService().delete(+id)
    return isDelete
  }
}
