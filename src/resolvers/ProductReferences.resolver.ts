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
  ProductReference,
  ProductReferenceCreateInput,
  ProductReferenceUpdateInput,
} from '../entities/ProductReference.entity'
import { validate } from 'class-validator'
import { Category } from '../entities/Category.entity'
import { formatValidationErrors } from '../utils/utils'
import { MyContext } from '../types/Context.type'
import { Picture } from '../entities/Picture.entity'

@Resolver(() => ProductReference)
export class ProductReferenceResolver {
  @Authorized('ADMIN')
  @Mutation(() => ProductReference)
  async createProductReference(
    @Ctx() context: MyContext,
    @Arg('data') data: ProductReferenceCreateInput
  ): Promise<ProductReference> {
    if (!context.user) {
      throw new Error('Vous devez être connecté pour effectuer cette action')
    }
    try {
      const newProductReference = new ProductReference()
      const category = await Category.findOne({
        where: { id: data.category.id },
      })
      if (!category) {
        throw new Error('Aucune catégorie trouvé')
      }
      const newPicture = await Picture.findOne({
        where: { id: data.pictures[0].id },
      })

      if (!newPicture) {
        throw new Error('Aucune image trouvé')
      }
      Object.assign(newProductReference, data)
      newProductReference.createdBy = context.user
      const errors = await validate(newProductReference)
      if (errors.length > 0) {
        const validationMessages = formatValidationErrors(errors)
        throw new Error(validationMessages || 'Une erreur est survenue.')
      }
      await newProductReference.save()
      return newProductReference
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  @Query(() => [ProductReference])
  async getProductsReferences(): Promise<ProductReference[]> {
    try {
      const productReferences = await ProductReference.find({
        relations: {
          category: true,
          createdBy: true,
          updatedBy: true,
          stock: true,
          pictures: true,
        },
      })

      return productReferences
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  @Query(() => ProductReference)
  async getProductReference(@Arg('id', () => ID) id: number) {
    try {
      const productRef = await ProductReference.findOne({
        where: { id },
        relations: {
          category: true,
          pictures: true,
          productCarts: { cartReference: { owner: true } },
          createdBy: true,
          updatedBy: true,
        },
      })
      if (productRef) {
        for (const item of productRef.pictures) {
          if (item.id) {
            const picture = await Picture.findOne({
              where: { id: item.id },
              relations: {
                productReference: true,
              },
            })
            if (picture) {
              Object.assign(item, picture)
            }
          }
        }
      }
      if (!productRef) {
        throw new Error('Aucun produit trouvé')
      }
      return productRef
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  @Authorized('ADMIN')
  @Mutation(() => ProductReference)
  async updateProductReference(
    @Arg('id', () => ID) id: number,
    @Arg('data') data: ProductReferenceUpdateInput
  ) {
    try {
      const productRef = await ProductReference.findOne({
        where: { id: id },
        relations: {
          category: true,
        },
      })
      if (!productRef) {
        throw new Error('Aucun produit trouvé')
      }
      if (productRef) {
        Object.assign(productRef, data)
        const errors = await validate(productRef)
        if (errors.length > 0) {
          const validationMessages = formatValidationErrors(errors)
          throw new Error(validationMessages || 'Une erreur est survenue.')
        }
        await productRef.save()
      }
      return productRef
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  @Authorized('ADMIN')
  @Mutation(() => ProductReference)
  async deleteProductReference(@Arg('id', () => ID) id: number) {
    try {
      const productRef = await ProductReference.findOne({
        where: { id },
        relations: {
          category: true,
          stock: true,
        },
      })
      if (!productRef) {
        throw new Error('Aucun produit trouvé')
      }
      await productRef.remove()

      Object.assign(productRef, { id })
      return productRef
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}
