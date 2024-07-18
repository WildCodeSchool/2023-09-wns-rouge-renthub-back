import { SeederFactoryManager } from 'typeorm-extension'
import { ProductCart } from '../../entities/ProductCart.entity'
import { ProductReference } from '../../entities/ProductReference.entity'
import { Cart } from '../../entities/Cart.entity'

export type ProductCartsSeederTypes = {
  productCartsSaved: ProductCart[]
}

/**
 * Seed the product carts by associating random products with each cart.
 * @param cartsSaved - The array of saved carts.
 * @param productReferences - The array of product references.
 * @param factoryManager - The seeder factory manager.
 * @returns An object containing the saved product carts.
 */
export default async function productCartsSeeder(
  cartsSaved: Cart[],
  productReferences: ProductReference[],
  factoryManager: SeederFactoryManager
) {
  const productCartsSaved: ProductCart[] = []

  for (const cart of cartsSaved) {
    const productCartFactory = factoryManager.get(ProductCart)
    const randomCountProducts = Math.floor(Math.random() * 5)

    const productReferencesToSave: ProductReference[] = []

    for (let i = 0; i < randomCountProducts; i++) {
      const listOfProductsReferencesLeft = productReferences.filter(
        (el) => !productReferencesToSave.find((el2) => el.id === el2.id)
      )
      const productReference =
        listOfProductsReferencesLeft[
          Math.floor(Math.random() * listOfProductsReferencesLeft.length)
        ]
      productReferencesToSave.push(productReference)

      const productCart = await productCartFactory.make()
      productCart.quantity = Math.ceil(Math.random() * 5)

      productCart.productReference =
        productReferencesToSave[productReferencesToSave.length - 1]

      productCart.cartReference = cart

      await productCart.save()
      productCartsSaved.push(productCart)
    }
  }
  return { productCartsSaved }
}
