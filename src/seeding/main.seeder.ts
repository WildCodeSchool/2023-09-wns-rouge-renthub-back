import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import productReferencesSeeder, {
  ProductReferencesSeederTypes,
} from './services/productReferences.seedService'
import usersSeeder, { UsersSeederTypes } from './services/users.seedService'
import categoriesSeeder, {
  CategoriesSeederTypes,
} from './services/categories.seedService'
import stocksSeeder, { StocksSeederTypes } from './services/stocks.seedService'
import rolesSeeder, { RolesSeederTypes } from './services/roles.seedService'
import productCartsSeeder, {
  ProductCartsSeederTypes,
} from './services/productCarts.seedService'
import orderSeeder, {
  OrdersSeederTypes,
} from './services/orders/orders.seedService'

const args = process.argv.slice(2) // Get command line arguments
const [numUsers = 30] = args.map(Number)

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const { rolesSaved }: RolesSeederTypes = await rolesSeeder(factoryManager)

    const { usersSaved, cartsSaved, admins }: UsersSeederTypes =
      await usersSeeder(rolesSaved, numUsers, factoryManager)

    const { categoriesSaved }: CategoriesSeederTypes = await categoriesSeeder(
      admins,
      factoryManager
    )
    // Count Categories and 1st level subcategories
    const countCategories = categoriesSaved.filter(
      (category) => !category.parentCategory
    ).length
    const countSubCategories = categoriesSaved.filter(
      (category) => category.parentCategory !== null
    ).length

    const { productReferencesSaved }: ProductReferencesSeederTypes =
      await productReferencesSeeder(categoriesSaved, factoryManager)

    const { stocksSaved }: StocksSeederTypes = await stocksSeeder(
      productReferencesSaved,
      factoryManager
    )

    const { productCartsSaved }: ProductCartsSeederTypes =
      await productCartsSeeder(
        cartsSaved,
        productReferencesSaved,
        factoryManager
      )

    const { ordersSaved, orderStocksSaved }: OrdersSeederTypes =
      await orderSeeder(usersSaved, stocksSaved, factoryManager)

    console.warn({
      '✅ Admins seeded': 5,
      '✅ Users seeded': numUsers,
      '✅ Carts seeded': usersSaved.length,
      '✅ Roles seeded': rolesSaved.length,
      '✅ Categories seeded': countCategories,
      '✅ 1st SubCategories seeded': countSubCategories,
      '✅ Products seeded': productReferencesSaved.length,
      '✅ Stocks seeded': stocksSaved.length,
      '✅ ProductCarts seeded': productCartsSaved.length,
      '✅ Orders seeded': ordersSaved.length,
      '✅ OrdersStocks seeded': orderStocksSaved.length,
    })
  }
}
