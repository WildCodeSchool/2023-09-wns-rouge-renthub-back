import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm'
import { dataSource } from '../datasource'
import { ProductReference } from '../entities/ProductReference.entity'
import { Cart } from '../entities/Cart.entity'
import { calculateDaysBetweenDates } from '../utils/utils'

@EventSubscriber()
export class ProductReferenceSubscriber
  implements EntitySubscriberInterface<ProductReference>
{
  /**
   * Specifies the entity to which this subscriber listens.
   * @returns The entity class to listen to.
   */
  listenTo() {
    return ProductReference
  }

  /**
   * Handles the afterUpdate event triggered when a ProductReference is updated in DB.
   * It updates the total price of the carts associated to updated ProductReference.
   * @remarks dataSource.getRepository(Cart).update() is used to update the totalPrice of the Cart without touching ProductCart relation.
   * @remarks The total price is calculated by multiplying the original Car quantity of the product by the price of the product and the number of days the product is rented.
   * @param event - The UpdateEvent object containing the updated entity.
   * @returns A Promise that resolves when the operation is complete.
   */
  async afterUpdate(event: UpdateEvent<ProductReference>): Promise<void> {
    try {
      const updatedProductReference = event.entity
      if (!updatedProductReference)
        throw new Error('Updated ProductReference not found in event')

      const originalProductReference = event.databaseEntity
      if (!originalProductReference)
        throw new Error('Original ProductReference not found in event')

      const carts = await dataSource.getRepository(Cart).find({
        where: {
          productCart: {
            productReference: {
              id: originalProductReference.id,
            },
          },
        },
        relations: { productCart: { productReference: true } },
      })

      await Promise.all(
        carts.map(async (cart) => {
          const productCarts = cart.productCart

          const productCartassociated = productCarts.find(
            (productCart) =>
              productCart.productReference.id === updatedProductReference.id
          )
          if (!productCartassociated)
            throw new Error('ProductCart 404: afterUpdate : ProductReference')

          let totalPriceAdjustment = 0

          const daysCount = calculateDaysBetweenDates(
            productCartassociated.dateTimeStart,
            productCartassociated.dateTimeEnd
          )

          totalPriceAdjustment -=
            productCartassociated.quantity *
            originalProductReference.price *
            daysCount
          totalPriceAdjustment +=
            productCartassociated.quantity *
            updatedProductReference.price *
            daysCount
          await dataSource.getRepository(Cart).update(cart.id, {
            totalPrice: cart.totalPrice + totalPriceAdjustment,
          })
        })
      )
    } catch (error) {
      console.error(error)
    }
  }
}
