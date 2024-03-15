import { Arg, ID, Mutation, Query, Resolver } from 'type-graphql'
import {
  ProductReference,
  ProductReferenceCreateInput,
  ProductReferenceUpdateInput,
} from '../entities/ProductReference.entity'
import { validate } from 'class-validator'
import { Category } from '../entities/Category'
import { formatValidationErrors } from '../utils/utils'

@Resolver(() => ProductReference)
export class ProductReferenceResolver {
  @Mutation(() => ProductReference)
  async createProductReference(
    @Arg('data') data: ProductReferenceCreateInput
  ): Promise<ProductReference> {
    try {
      const productReference = new ProductReference()
      const currentCategory: any = await Category.findOne({
        where: { id: data.category.id },
      })
      if (!currentCategory) {
        throw new Error('Aucune catégorie trouvé')
      }
      Object.assign(productReference, {
        ...data,
        category: {
          id: data.category.id,
        },
      })
      const errors = await validate(productReference)
      if (errors.length > 0) {
        const validationMessages = formatValidationErrors(errors)
        throw new Error(validationMessages || 'Une erreur est survenue.')
      }
      await productReference.save()
      return productReference
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
        },
      })
      if (!productReferences) {
        throw new Error('Aucun produit trouvé')
      }
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
          createdBy: true,
          updatedBy: true,
        },
      })
      if (!productRef) {
        throw new Error('Aucun produit trouvé')
      }
      return productRef
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

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

  @Mutation(() => Boolean, { nullable: true })
  async deleteProductReference(@Arg('id', () => ID) id: number) {
    try {
      const productRef = await ProductReference.findOne({
        where: { id },
        relations: {
          category: true,
        },
      })
      if (!productRef) {
        throw new Error('Aucun produit trouvé')
      }
      await productRef.remove()
      return true
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}
