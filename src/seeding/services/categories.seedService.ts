import { SeederFactory, SeederFactoryManager } from 'typeorm-extension'
import { User } from '../../entities/User.entity'
import { Category } from '../../entities/Category.entity'

export type CategoriesSeederTypes = {
  categoriesSaved: Category[]
}

export default async function categoriesSeeder(
  admins: User[],
  factoryManager: SeederFactoryManager
): Promise<CategoriesSeederTypes> {
  const categoriesSaved: Category[] = []
  const categoryFactory = factoryManager.get(Category)
  const categoriesNames = [
    { name: 'Tech', subCategories: ['Computer', 'Mobile', 'TV'] },
    { name: 'Cars', subCategories: ['Race', 'SUV', 'Off road'] },
    { name: 'Bikes', subCategories: ['Mountain', 'City'] },
  ]
  for (let i = 0; i < categoriesNames.length; i++) {
    const categoriesSet = categoriesNames[i]
    const mainCategoryName = categoriesSet.name

    const mainCategory = await createMainCategory(
      admins,
      mainCategoryName,
      categoryFactory,
    )
    categoriesSaved.push(mainCategory)

    const subCategoriesSaved = await createSubcategories(admins, categoriesSet.subCategories, categoryFactory, mainCategory)
    categoriesSaved.push(...subCategoriesSaved)
  }  
  return { categoriesSaved }
}

async function createMainCategory(
  admins: User[],
  mainCategoryName: string,
  categoryFactory: SeederFactory<Category, unknown>,
) {
  const mainCategory = await categoryFactory.make()
  mainCategory.name = mainCategoryName
  mainCategory.createdBy = admins[Math.floor(Math.random() * admins.length)].id
  const mainCategorySaved = await mainCategory.save()
  return mainCategorySaved
}

async function createSubcategories(
  admins: User[],
  subCategories: string[],
  categoryFactory: SeederFactory<Category, unknown>,
  mainCategory: Category
) {
  const subCategoriesSaved: Category[] = []  
  for (let i = 0; i < subCategories.length; i++) {
    const subCategoryName = subCategories[i]

    const subCategory = await categoryFactory.make()
    subCategory.name = subCategoryName
    subCategory.createdBy = admins[Math.floor(Math.random() * admins.length)].id
    subCategory.parentCategory = mainCategory
    const subCategorySaved = await subCategory.save()
    subCategoriesSaved.push(subCategorySaved)
  }
  return subCategoriesSaved
}
