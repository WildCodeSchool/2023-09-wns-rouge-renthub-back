import { Repository } from 'typeorm'
import { validate } from 'class-validator'
import { dataSource } from '../datasource'
import { formatValidationErrors } from '../utils/utils'
import {
  ProductReference,
  ProductReferenceCreateInput,
  ProductReferenceUpdateInput,
} from '../entities/ProductReference.entity'
import { CategoryService } from './Category.service'

export class ProductReferenceService {
  db: Repository<ProductReference>
  constructor() {
    this.db = dataSource.getRepository(ProductReference)
  }

  async findAll() {
    const productReferences = await this.db.find({
      relations: {
        category: { parentCategory: true },
        createdBy: true,
        updatedBy: true,
        stock: true,
        productCart: { cartReference: { owner: { role: true } } },
      },
    })
    if (!productReferences) {
      throw new Error('ProductReferences not found')
    }
    return productReferences
  }

  async find(id: number) {
    const productReference = await this.db.findOne({
      where: { id },
      relations: {
        category: { parentCategory: true },
        createdBy: true,
        updatedBy: true,
        stock: true,
        productCart: { cartReference: { owner: { role: true } } },
      },
    })
    if (!productReference) {
      throw new Error(`ProductReference with id < ${id} > not found`)
    }
    return productReference
  }

  async create(data: ProductReferenceCreateInput) {
    const productReference = new ProductReference()
    const currentCategory = await new CategoryService().find(data.category.id)
    if (!currentCategory) {
      throw new Error(`Category with id : < ${data.category.id} > not found`)
    }

    Object.assign(productReference, { ...data })

    const errors = await validate(productReference)
    if (errors.length > 0) {
      const validationMessages = formatValidationErrors(errors)
      throw new Error(validationMessages || 'Validation error occured')
    }

    const { id } = await productReference.save()
    if (!id) throw new Error('ProductReference not created')

    const newProductReference = await this.db.findOne({
      where: { id },
      relations: {
        category: { parentCategory: true },
        createdBy: true,
        updatedBy: true,
      },
    })
    if (!newProductReference)
      throw new Error(
        `ProductReference created with id => < ${id} > but it was not found!`
      )
    return newProductReference
  }

  async update(id: number, data: ProductReferenceUpdateInput) {
    const productReference = await this.db.findOne({
      where: { id },
      relations: {
        category: true,
      },
    })
    if (!productReference) {
      throw new Error('ProductReference not found')
    }
    if (productReference) {
      Object.assign(productReference, data)
      const errors = await validate(productReference)
      if (errors.length > 0) {
        const validationMessages = formatValidationErrors(errors)
        throw new Error(validationMessages || 'Une erreur est survenue.')
      }
      await productReference.save()
    }
    return productReference
  }

  async delete(id: number) {
    const productReference = await this.db.findOne({
      where: { id },
      relations: {
        category: true,
        stock: true,
      },
    })
    if (!productReference) {
      throw new Error(`ProductReference with id : < ${id} > not found`)
    }
    await productReference.remove()

    Object.assign(productReference, { id })

    return productReference
  }
}
