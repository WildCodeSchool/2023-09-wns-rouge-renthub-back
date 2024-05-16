import { SeederFactoryManager } from 'typeorm-extension'
import { ProductCart } from '../../entities/ProductCart.entity'
import { ProductReference } from '../../entities/ProductReference.entity'
import { Cart } from '../../entities/Cart.entity'

function calculateDaysBetweenDates(dateStart: Date, dateEnd: Date): number {
  const start = new Date(dateStart)
  const end = new Date(dateEnd)
  start.setUTCHours(0, 0, 0, 0)
  end.setUTCHours(0, 0, 0, 0)

  if (start.toDateString() === end.toDateString()) return 1

  const timeDifference = end.getTime() - start.getTime()

  const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))

  return dayDifference
}

export type ProductCartsSeederTypes = {
  productCartsSaved: ProductCart[]
}

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

    let totalPrice = 0
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

      const countDays = calculateDaysBetweenDates(
        productCart.dateTimeStart,
        productCart.dateTimeEnd
      )

      totalPrice += productCart.quantity * productCart.productReference.price * countDays
      
      await productCart.save()
      productCartsSaved.push(productCart)
    }
    cart.totalPrice = totalPrice
    await cart.save()
  }

  return { productCartsSaved }
}
