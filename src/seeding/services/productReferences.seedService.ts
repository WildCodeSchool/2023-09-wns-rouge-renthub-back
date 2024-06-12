import { SeederFactoryManager } from 'typeorm-extension'
import { Category } from '../../entities/Category.entity'
import { ProductReference } from '../../entities/ProductReference.entity'

export type ProductReferencesSeederTypes = {
  productReferencesSaved: ProductReference[]
}

export default async function productReferencesSeeder(
  categoriesSaved: Category[],
  factoryManager: SeederFactoryManager
) {
  const productReferencesSaved: ProductReference[] = []
  const productsNames = [
    {
      category: categoriesSaved[1], // computer
      products: [
        { name: 'Dell 16', brandName: 'Dell' },
        { name: 'Asus 14', brandName: 'Asus' },
        { name: 'MacBook 16', brandName: 'Apple' },
      ],
    },
    {
      category: categoriesSaved[2], // Mobile
      products: [
        { name: 'Iphone 15 Pro Max', brandName: 'Apple' },
        { name: 'Iphone 14 Pro', brandName: 'Apple' },
        { name: 'Iphone 12', brandName: 'Apple' },
        { name: 'Pixel', brandName: 'Google' },
        { name: 'Flip5', brandName: 'Samsung' },
        { name: 'Fold4', brandName: 'Samsung' },
        { name: 'Galaxy S24', brandName: 'Samsung' },
      ],
    },
    {
      category: categoriesSaved[3], // TV
      products: [
        { name: 'OLED 65', brandName: 'LG' },
        { name: 'QLED 65', brandName: 'Samsung' },
        { name: '4K 65', brandName: 'Sony' },
        { name: '8K 65', brandName: 'Samsung' },
        { name: 'NanoCell 65', brandName: 'LG' },
      ],
    },
    {
      category: categoriesSaved[5], // Race cars
      products: [
        { name: 'Ferrari', brandName: 'Ferrari' },
        { name: 'Lamborghini', brandName: 'Lamborghini' },
        { name: 'Porsche', brandName: 'Porsche' },
        { name: 'Bugatti', brandName: 'Bugatti' },
        { name: 'McLaren', brandName: 'McLaren' },
      ],
    },
    {
      category: categoriesSaved[6], // SUV
      products: [
        { name: 'Range Rover', brandName: 'Land Rover' },
        { name: 'Jeep', brandName: 'Jeep' },
        { name: 'Toyota', brandName: 'Toyota' },
        { name: 'Ford', brandName: 'Ford' },
        { name: 'Nissan', brandName: 'Nissan' },
      ],
    },
    {
      category: categoriesSaved[7], // Off road car
      products: [
        { name: 'Jeep', brandName: 'Jeep' },
        { name: 'Toyota', brandName: 'Toyota' },
        { name: 'Ford', brandName: 'Ford' },
        { name: 'Nissan', brandName: 'Nissan' },
        { name: 'Land Rover', brandName: 'Land Rover' },
      ],
    },
    {
      category: categoriesSaved[9], // Mountain bike
      products: [
        { name: 'Giant', brandName: 'Giant' },
        { name: 'Trek', brandName: 'Trek' },
        { name: 'Specialized', brandName: 'Specialized' },
        { name: 'Cannondale', brandName: 'Cannondale' },
        { name: 'Scott', brandName: 'Scott' },
      ],
    },
    {
      category: categoriesSaved[10], // City bike
      products: [
        { name: 'Giant City', brandName: 'Giant' },
        { name: 'Specialized City', brandName: 'Specialized' },
        { name: 'Cannondale City', brandName: 'Cannondale' },
        { name: 'Scott City', brandName: 'Scott' },
      ],
    },
  ]
  const productReferenceFactory = factoryManager.get(ProductReference)
  for (let i = 0; i < productsNames.length; i++) {
    const productGroup = productsNames[i]

    const countProducts = productsNames[i].products.length
    const productReferences =
      await productReferenceFactory.saveMany(countProducts)
    productReferences.sort((a, b) => a.id - b.id)

    for (let j = 0; j < productReferences.length; j++) {
      const productReference = productReferences[j]
      productReference.name = productGroup.products[j].name
      productReference.brandName = productGroup.products[j].brandName
      productReference.category = productGroup.category
      await productReference.save()
      productReferencesSaved.push(productReference)
    }
  }
  
  return { productReferencesSaved }
}
