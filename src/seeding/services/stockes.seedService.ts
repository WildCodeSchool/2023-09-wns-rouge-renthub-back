import { SeederFactoryManager } from 'typeorm-extension'
import { Stock } from '../../entities/Stock.entity'
import { ProductReference } from '../../entities/ProductReference.entity'

export type StockesSeederTypes = {
  stocksSaved: Stock[]
}

export default async function stockesSeeder(
  productsRefereces: ProductReference[],
  factoryManager: SeederFactoryManager
) {
  const stocksSaved: Stock[] = []
 
  const stockFactory = factoryManager.get(Stock)
  
  for (const productReferece of productsRefereces) {
    const stockes = await stockFactory.saveMany(5)
    stockes.sort((a, b) => a.id - b.id)

    for (const stock of stockes) {

      stock.name = `${productReferece.name} ${stock.name}`
      stock.isAvailable = Math.random() > 0.5
      stock.productReference = productReferece
      const stockSaved = await stock.save()
      stocksSaved.push(stockSaved)
    }
  }

  return { stocksSaved }
}
