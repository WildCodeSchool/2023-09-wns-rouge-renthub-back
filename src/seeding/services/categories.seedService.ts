import { SeederFactoryManager } from 'typeorm-extension'
import { User } from '../../entities/User.entity'
import { Category } from '../../entities/Category.entity'

export type CategoriesSeederTypes = {
  categoriesSaved: Category[]
}

export default async function categoriesSeeder(
  users: User[],
  factoryManager: SeederFactoryManager
) {
  const categoriesSaved: Category[] = []
  const categoryFactory = factoryManager.get(Category)
  const categoriesNames = [
    { name: 'Tech', subCategories: ['Computer', 'Mobile', 'TV'] },
    { name: 'Cars', subCategories: ['Race', 'SUV', 'Off road'] },
    { name: 'Bikes', subCategories: ['Mountain', 'City'] },
  ]
  for (let i = 0; i < categoriesNames.length; i++) {
    const category = categoriesNames[i]

    const countCategories = category.subCategories.length + 1
    const categories = await categoryFactory.saveMany(countCategories)
    categories.sort((a, b) => a.id - b.id)

    categories[0].name = category.name
    categories[0].createdBy = Math.floor(Math.random() * users.length)

    const categoryParent = await categories[0].save()
    categoriesSaved.push(categoryParent)

    for (let i = 1; i < categories.length; i++) {
      const subCategory = categories[i]
      subCategory.name = category.subCategories[i - 1]
      subCategory.createdBy = Math.floor(Math.random() * users.length)
      subCategory.parentCategory = categoryParent
      const subCategories = await subCategory.save()
      categoriesSaved.push(subCategories)
    }
  }

  return { categoriesSaved }
}
