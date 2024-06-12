import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import productReferencesSeeder, {
  ProductReferencesSeederTypes,
} from './services/productReferences.seedService'
import usersSeeder, {
  UsersSeederTypes,
} from './services/users&Carts.seedService'
import categoriesSeeder, {
  CategoriesSeederTypes,
} from './services/categories.seedService'
import stockesSeeder, {
  StockesSeederTypes,
} from './services/stockes.seedService'
import rolesSeeder, { RolesSeederTypes } from './services/roles.seedService'
import productCartsSeeder, {
  ProductCartsSeederTypes,
} from './services/productCarts.seedService'

const args = process.argv.slice(2) // Get command line arguments
const [numUsers = 30] = args.map(Number)

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const { rolesSaved }: RolesSeederTypes = await rolesSeeder(factoryManager)

    const { usersSaved, cartsSaved }: UsersSeederTypes = await usersSeeder(
      rolesSaved,
      numUsers,
      factoryManager
    )

    const { categoriesSaved }: CategoriesSeederTypes = await categoriesSeeder(
      usersSaved,
      factoryManager
    )

    const { productReferencesSaved }: ProductReferencesSeederTypes =
      await productReferencesSeeder(categoriesSaved, factoryManager)

    const { stocksSaved }: StockesSeederTypes = await stockesSeeder(
      productReferencesSaved,
      factoryManager
    )

    const { productCartsSaved }: ProductCartsSeederTypes =
      await productCartsSeeder(
        cartsSaved,
        productReferencesSaved,
        factoryManager
      )

    // Count Categories and 1st level subcategories
    const countCategories = categoriesSaved.filter(
      (category) => !category.parentCategory
    ).length
    const countSubCategories = categoriesSaved.filter(
      (category) => category.parentCategory !== null
    ).length

    console.info('SEED DONE 🎉')
    console.table({
      '✅ Admins seeded': 5,
      '✅ Users seeded': numUsers,
      '✅ Carts seeded': usersSaved.length,
      '✅ Roles seeded': rolesSaved.length,
      '✅ Categories seeded': countCategories,
      '✅ 1st SubCategories seeded': countSubCategories,
      '✅ Products seeded': productReferencesSaved.length,
      '✅ Stockes seeded': stocksSaved.length,
      '✅ ProductCarts seeded': productCartsSaved.length,
    })
  }
}
