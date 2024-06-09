import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm'
import { ProductCart } from '../entities/ProductCart.entity'
import { Cart } from '../entities/Cart.entity'
import { dataSource } from '../datasource'
import { ProductReference } from '../entities/ProductReference.entity'

/**
 * Calculates the number of days between two dates.
 * @param dateStart - The start date.
 * @param dateEnd - The end date.
 * @returns The number of days between the two dates.
 */
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

@EventSubscriber()
export class ProductCartSubscriber
  implements EntitySubscriberInterface<ProductCart>
{
  /**
   * Specifies the entity to which this subscriber listens.
   * @returns The entity class to listen to.
   */
  listenTo() {
    return ProductCart
  }

  /**
   * Handles the afterInsert event triggered when a new ProductCart entity is inserted.
   * It updates the total price of the cart to which the new ProductCart belongs.
   * @remarks The total price is calculated by multiplying the quantity of the product by the price of the product and the number of days the product is rented.
   * @param event - The InsertEvent object containing the inserted entity.
   * @returns A Promise that resolves when the operation is complete.
   */
  async afterInsert(event: InsertEvent<ProductCart>): Promise<void> {
    try {
      const cartId = event.entity.cartReference.id
      const insertedProductId = event.entity.productReference.id
      const insertedProductCart = event.entity

      const currentCart = await dataSource.getRepository(Cart).findOne({
        where: { id: cartId },
        relations: {
          productCart: { productReference: { category: true } },
        },
      })
      if (!currentCart) throw new Error('Cart not found')

      const insertedProductReference = await dataSource
        .getRepository(ProductReference)
        .findOne({ where: { id: insertedProductId } })
      if (!insertedProductReference)
        throw new Error('ProductReference not found')

      const newTotalPrice =
        currentCart.totalPrice +
        insertedProductCart.quantity *
          insertedProductReference.price *
          calculateDaysBetweenDates(
            insertedProductCart.dateTimeStart,
            insertedProductCart.dateTimeEnd
          )

      currentCart.totalPrice = newTotalPrice

      await currentCart.save()
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Handles the afterRemove event triggered when a ProductCart entity is removed.
   * It updates the total price of the cart to which the removed ProductCart belongs.
   * @remarks The total price is calculated by multiplying the quantity of the product by the price of the product and the number of days the product is rented.
   * @param event - The RemoveEvent object containing the removed entity.
   * @returns A Promise that resolves when the operation is complete.
   */
  async afterRemove(event: RemoveEvent<ProductCart>): Promise<void> {
    try {
      const cartId = event.entity?.cartReference.id
      if (!cartId) throw new Error('CartId not found')

      const removedProductCart = event.entity
      if (!removedProductCart)
        throw new Error('RemovedProductCart event.entity not found')

      const currentCart = await dataSource.getRepository(Cart).findOne({
        where: { id: cartId },
        relations: {
          productCart: { productReference: { category: true } },
        },
      })

      if (!currentCart) throw new Error('Cart not found')

      const removedProductCartPrice =
        removedProductCart.quantity *
        removedProductCart.productReference.price *
        calculateDaysBetweenDates(
          removedProductCart.dateTimeStart,
          removedProductCart.dateTimeEnd
        )
      currentCart.totalPrice -= removedProductCartPrice
      await currentCart.save()
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Handles the afterUpdate event triggered when a ProductCart entity is updated.
   * It updates the total price of the cart to which the updated ProductCart belongs.
   * @remarks The total price is calculated by multiplying the quantity of the product by the price of the product and the number of days the product is rented.
   * @remarks The updated columns are checked to determine which properties of the ProductCart entity have been updated.
   * @remarks If the quantity, dateTimeStart, or dateTimeEnd properties have been updated, the total price of the cart is recalculated.
   * @param event - The UpdateEvent object containing the updated entity.
   * @returns A Promise that resolves when the operation is complete.
   */
  async afterUpdate(event: UpdateEvent<ProductCart>): Promise<void> {
    try {
      const updatedProductCart = event.entity

      if (!updatedProductCart) throw new Error('ProductCart not found in event')

      const updatedColumns = event.updatedColumns.map(
        (column) => column.propertyName
      )

      const quantity = updatedColumns.includes('quantity')
        ? updatedProductCart.quantity
        : event.databaseEntity.quantity
      const dateTimeStart = updatedColumns.includes('dateTimeStart')
        ? updatedProductCart.dateTimeStart
        : event.databaseEntity.dateTimeStart
      const dateTimeEnd = updatedColumns.includes('dateTimeEnd')
        ? updatedProductCart.dateTimeEnd
        : event.databaseEntity.dateTimeEnd
      const productReferencePrice: number =
        updatedProductCart.productReference.price

      const countDays = calculateDaysBetweenDates(
        new Date(dateTimeStart),
        new Date(dateTimeEnd)
      )

      const newTotalPrice = quantity * productReferencePrice * countDays

      const cartId: number = updatedProductCart.cartReference.id
      const currentCart = await dataSource.getRepository(Cart).findOne({
        where: { id: cartId },
      })
      if (!currentCart) throw new Error('Cart not found')

      currentCart.totalPrice = newTotalPrice

      await currentCart.save()
    } catch (error) {
      console.error(error)
    }
  }
}
