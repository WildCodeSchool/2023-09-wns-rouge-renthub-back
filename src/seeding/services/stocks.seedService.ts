import { SeederFactoryManager } from 'typeorm-extension'
import { Stock } from '../../entities/Stock.entity'
import { ProductReference } from '../../entities/ProductReference.entity'

export type StocksSeederTypes = {
  stocksSaved: Stock[]
}

export default async function stocksSeeder(
  productsRefereces: ProductReference[],
  factoryManager: SeederFactoryManager
) {
  const stocksSaved: Stock[] = []
 
  const stockFactory = factoryManager.get(Stock)
  
  for (const productReferece of productsRefereces) {
    const stocks = await stockFactory.saveMany(5)
    stocks.sort((a, b) => a.id - b.id)

    for (const stock of stocks) {

      stock.name = `${productReferece.name} ${stock.name}`
      stock.isAvailable = Math.random() > 0.5
      stock.productReference = productReferece
      const stockSaved = await stock.save()
      stocksSaved.push(stockSaved)
    }
  }

  return { stocksSaved }
}
