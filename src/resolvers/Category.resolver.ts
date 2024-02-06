import { CategoryService } from '../services/Category.services'
import {
  Arg,
  Field,
  ID,
  InputType,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql'
import { Category } from '../entities/Category'

@Resolver(() => Category)
export class CategoriesResolver {
  @Query(() => [Category])
  async listCategories(): Promise<Category[]> {
    const categories = await new CategoryService().list()

    return categories
  }
}
