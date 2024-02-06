import { Category, CategoryInput } from './../entities/Category'
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

  async create(category: CategoryInput) {
    const errors = await validate(category)
    if (errors.length > 0) {
      throw new Error('Validation failed!')
    }
    const newCategory = this.db.create(category)
    await this.db.save(newCategory)
    return newCategory
  }
}
