import { CategoryService } from '../services/Category.service'
import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql'
import {
  Category,
  CategoryCreateInput,
  CategoryUpdateInput,
} from '../entities/Category.entity'
import { ProductReferenceService } from '../services/ProductReference.service'
import { IsNull } from 'typeorm'
import { MyContext } from '../types/Context.type'

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
    await Promise.all(
      categoryById.productReferences.map(async (productRef) => {
        const productWithPictures = await new ProductReferenceService().find(
          productRef.id
        )
        // Mettre à jour le productRef avec les détails complets incluant les images
        Object.assign(productRef, productWithPictures)
      })
    )

    return categoryById
  }

  @Authorized('ADMIN')
  @Mutation(() => Category)
  async createCategory(
    @Arg('data') data: CategoryCreateInput,
    @Ctx() context: MyContext
  ) {
    if (!context.user) {
      throw new Error('User not found')
    }
    const newCategory = await new CategoryService().create(data, context.user)

    return newCategory
  }

  @Authorized('ADMIN')
  @Mutation(() => Category, { nullable: true })
  async updateCategory(@Arg('data') data: CategoryUpdateInput) {
    const category = await new CategoryService().update(data)

    return category
  }

  @Authorized('ADMIN')
  @Mutation(() => Boolean, { nullable: true })
  async deleteCategory(@Arg('id', () => ID) id: number) {
    const isDelete = await new CategoryService().delete(+id)

    return isDelete
  }

  // GET ALL WITH FULL HIERARCHY
  @Query(() => [Category])
  async categoriesGetAllWithHierarchy(): Promise<Category[]> {
    // Fetch all root categories with their full hierarchy
    const rootCategories = await Category.find({
      where: { parentCategory: IsNull(), display: true },
      relations: {
        childCategories: true,
      },
      order: { id: 'ASC' },
    })

    return rootCategories
  }
}
