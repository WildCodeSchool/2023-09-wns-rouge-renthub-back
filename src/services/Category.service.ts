import {
  Category,
  CategoryCreateInput,
  CategoryUpdateInput,
} from '../entities/Category'

import { Repository } from 'typeorm'
import { validate } from 'class-validator'
import { dataSource } from '../datasource'

export class CategoryService {
  db: Repository<Category>
  constructor() {
    this.db = dataSource.getRepository(Category)
  }

  async list() {
    const listCategory = this.db.find({
      relations: ['childCategories', 'parentCategory', 'picture'],
    })
    return listCategory
  }

  async find(id: number) {
    const category = await this.db.findOne({
      where: { id },
      relations: ['childCategories', 'parentCategory', 'picture'],
    })
    if (!category) {
      throw new Error('Category not found')
    }
    return category
  }

  async create(categoryInput: CategoryCreateInput) {
    const errors = await validate(categoryInput)

    if (errors.length > 0) {
      throw new Error('Validation failed!')
    }

    const newCategory = this.db.create(categoryInput)
    const { parentCategoryId } = categoryInput
    if (parentCategoryId) {
      const parentCategoryIdExist = await this.db.findOne({
        where: { id: parentCategoryId },
      })
      if (!parentCategoryIdExist) {
        throw new Error('Parent category not found')
      }
      Object.assign(newCategory, { parentCategory: parentCategoryIdExist })
    }
    const newCategorySave = await this.db.save(newCategory)
    return newCategorySave
  }

  async update(data: CategoryUpdateInput) {
    const errors = await validate(data)
    if (errors.length > 0) {
      throw new Error('Validation failed!')
    }
    data.id = +data.id
    const category = await this.db.findOne({
      where: { id: data.id },
      relations: ['childCategories', 'parentCategory'],
    })

    if (!category) {
      throw new Error('Category not found')
    }

    // modification du parent :
    if (data.parentCategoryId !== undefined) {
      const parentCategoryIdExist = await this.db.findOne({
        where: { id: data.parentCategoryId },
      })
      if (!parentCategoryIdExist) {
        throw new Error('Parent category not found')
      }
      Object.assign(category, { parentCategory: parentCategoryIdExist })
    }
    this.db.merge(category, data)
    const updatedCategory = await this.db.save(category)
    return updatedCategory
  }

  async delete(id: number) {
    const category = await this.db.findOne({
      where: { id },
      relations: ['childCategories', 'parentCategory'],
    })
    if (!category) {
      throw new Error('Category does exist')
    }

    // delete cascade children
    if (category.childCategories && category.childCategories.length > 0) {
      await Promise.all(
        category.childCategories.map(async (childCategory) => {
          await this.db.delete(childCategory.id)
        })
      )
    }
    this.db.remove(category)
    return true
  }
}
