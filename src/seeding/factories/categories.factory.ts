import { Faker } from '@faker-js/faker'
import { setSeederFactory } from 'typeorm-extension'
import { Category } from '../../entities/Category.entity'

export const CategoriesFactory = setSeederFactory(Category, (faker: Faker) => {
  const category = new Category() 
  category.name = `default name ${faker.number.int({min: 1, max: 100000})}`
  category.index = 1
  category.display = faker.datatype.boolean({probability: 0.9})
  return category
})
