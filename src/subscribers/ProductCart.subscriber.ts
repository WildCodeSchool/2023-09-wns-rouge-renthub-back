import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm'
import { ProductCart } from '../entities/ProductCart.entity'
import { dataSource } from '../datasource'
import { ProductReference } from '../entities/ProductReference.entity'
import { CartService } from '../services/Cart.service'
import { calculateDaysBetweenDates } from '../utils/utils'

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
   * Retrieves a ProductReference entity by its ID.
   * @param productReferenceId - The ID of the ProductReference entity.
   * @returns A Promise that resolves with the ProductReference entity.
   */
  private async getProductReferenceById(
    productReferenceId: number
  ): Promise<ProductReference> {
    const productReference = await dataSource
      .getRepository(ProductReference)
      .findOneBy({ id: productReferenceId })
    if (!productReference)
      throw new Error(
        `ProductReference with ID ${productReferenceId} not found`
      )
    return productReference
  }

  /**
   * Handles the afterInsert event triggered when a new ProductCart is inserted to DB.
   * It updates the total price of the cart to which the new ProductCart belongs by adding the price of the new ProductCart to a current totalPrice of a Cart.
   * @param event - The InsertEvent object containing the inserted entity.
   * @returns A Promise that resolves when the operation is complete.
   */
  async afterInsert(event: InsertEvent<ProductCart>): Promise<void> {
    try {
      const {
        cartReference: { id: cartId },
        productReference: { id: productReferenceId },
        dateTimeStart,
        dateTimeEnd,
        quantity,
      } = event.entity

      const productReference =
        await this.getProductReferenceById(productReferenceId)

      const cart = await new CartService().find(cartId)

      const currentTotalPrice = CartService.calculateTotalPrice(cart)

      const daysCount = calculateDaysBetweenDates(dateTimeStart, dateTimeEnd)

      const newProductCartTotalPrice =
        quantity * productReference.price * daysCount

      cart.totalPrice += currentTotalPrice + newProductCartTotalPrice

      await cart.save()
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Handles the afterRemove event triggered when a ProductCart is removed from DB.
   * It updates the total price of the cart to which the removed ProductCart belonged.
   * @remarks The total price is calculated by multiplying the quantity of the product by the price of the product and the number of days the product is rented.
   * @param event - The RemoveEvent object containing the removed entity.
   * @returns A Promise that resolves when the operation is complete.
   */
  async afterRemove(event: RemoveEvent<ProductCart>): Promise<void> {
    try {
      if (!event.entity)
        throw new Error('Removed ProductCart not found in event')

      const {
        cartReference: { id: cartId },
        productReference,
        dateTimeStart,
        dateTimeEnd,
        quantity,
      } = event.entity

      const cart = await new CartService().find(cartId)

      const currentTotalPrice = CartService.calculateTotalPrice(cart)

      const daysCountRemovedProductCart = calculateDaysBetweenDates(
        dateTimeStart,
        dateTimeEnd
      )

      const totalPriceRemovedProductCart =
        quantity * productReference.price * daysCountRemovedProductCart

      cart.totalPrice = currentTotalPrice - totalPriceRemovedProductCart
      await cart.save()
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Handles the afterUpdate event triggered when a ProductCart is updated from DB.
   * It updates the total price of the cart to which the updated ProductCart belongs.
   * @remarks The total price is calculated by multiplying the quantity of the product by the price of the product and the number of days the product is rented.
   * @param event - The UpdateEvent object containing the updated entity.
   * @returns A Promise that resolves when the operation is complete.
   */
  async afterUpdate(event: UpdateEvent<ProductCart>): Promise<void> {
    try {
      const updatedProductCart = event.entity
      if (!updatedProductCart) {
        return
      }

      const cartId = updatedProductCart.cartReference.id
      const cart = await new CartService().find(cartId)

      const countDays = calculateDaysBetweenDates(
        new Date(updatedProductCart.dateTimeStart),
        new Date(updatedProductCart.dateTimeEnd)
      )

      const newTotalPrice =
        updatedProductCart.quantity *
        updatedProductCart.productReference.price *
        countDays

      cart.totalPrice = newTotalPrice

      await cart.save()
    } catch (error) {
      console.error(error)
    }
  }
}
