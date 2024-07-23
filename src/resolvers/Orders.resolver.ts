import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql'
import { Order, StatusEnum } from '../entities/Order.entity'
import { MyContext } from '../types/Context.type'
import { CartService } from '../services/Cart.service'
import { formatValidationErrors, isRightUser } from '../utils/utils'
import { OrderService } from '../services/Order.service'
import { validate } from 'class-validator'
import { OrderStock } from '../entities/OrderStock.entity'
import { dataSource } from '../datasource'
import { StockService } from '../services/Stock.service'

@Resolver(() => Order)
export class OrdersResolver {
  @Authorized('ADMIN', 'USER')
  @Mutation(() => Order)
  async createOrder(
    @Ctx() context: MyContext
  ): Promise<Order> {
    // User context is missing or user is not authenticated
    if (!context.user) {
      throw new Error('User context is missing or user is not authenticated')
    }
    // Find the cart of the connected user
    const cart = await new CartService().find(+context.user.id)
    // Stock productReferencesIds
    const productCarts = cart.productCarts.map((productCart) => productCart)

    const undisposableProductReferences = []

    for (const productCart of productCarts) {
      const availableStocks =
        await new StockService().findAvailableStocksForDates(
          productCart.productReference.id,
          productCart.dateTimeStart,
          productCart.dateTimeEnd,
          productCart.quantity
        )

      if (availableStocks.length < productCart.quantity) {
        undisposableProductReferences.push(productCart.productReference)
      }
    }

    if (undisposableProductReferences.length > 0) {
      throw new Error(
        `The following products are not available: ${undisposableProductReferences.map(
          (product) => product.id
        )}`
      )
    }

    const newOrder = new Order()
    // Transaction to handle all operations
    await dataSource.transaction(async (transactionalEntityManager) => {
      newOrder.status = StatusEnum.INPROGRESS // Use enum value
      if (!context.user) {
        throw new Error('User context is missing or user is not authenticated')
      }
      newOrder.user = context.user
      const errors = await validate(newOrder)
      if (errors.length > 0) {
        const validationMessages = formatValidationErrors(errors)
        throw new Error(validationMessages || 'Validation error occured')
      }
      await transactionalEntityManager.save(newOrder)

      const orderStocksToInsert: OrderStock[] = []

      for (const productCart of productCarts) {
        const availableStocks =
          await new StockService().findAvailableStocksForDates(
            productCart.productReference.id,
            productCart.dateTimeStart,
            productCart.dateTimeEnd,
            productCart.quantity
          )

        const orderStockObjects: OrderStock[] = availableStocks.map((stock) => {
          const orderStock = new OrderStock()
          orderStock.dateTimeStart = productCart.dateTimeStart
          orderStock.dateTimeEnd = productCart.dateTimeEnd
          orderStock.order = newOrder
          orderStock.stock = stock
          return orderStock
        })
        orderStocksToInsert.push(...orderStockObjects)
      }

      await transactionalEntityManager.save(OrderStock, orderStocksToInsert)

      newOrder.status = StatusEnum.DONE
      await transactionalEntityManager.save(newOrder)
      cart.productCarts = []
      await transactionalEntityManager.save(cart)
    })
    const orderCompleted = await new OrderService().find(newOrder.id)
    return orderCompleted
  }

  @Authorized('ADMIN', 'USER')
  @Query(() => Order)
  async findOrder(@Ctx() context: MyContext, @Arg('id', () => ID) id: number) {
    const isUserAuthorised = isRightUser(id, context)
    if (!isUserAuthorised) {
      throw new Error('User not authorized to get this resource')
    }

    const user = context.user
    if (
      user?.role.right === 'ADMIN' ||
      user?.orders?.some((order) => order.id === id)
    ) {
      const order = await new OrderService().find(+id)
      return order
    }

    throw new Error('Not authorized')
  }

  @Authorized('ADMIN', 'USER')
  @Query(() => [Order])
  async findOrdersByContext(@Ctx() context: MyContext) {
    const user = context.user
    if (!user) {
      throw new Error('User context is missing')
    }
    const orders = await new OrderService().findByUserId(user.id)
    return orders
  }

  @Authorized('ADMIN')
  @Query(() => [Order])
  async findOrders() {
    const orders = await new OrderService().findAll()
    return orders
  }
}
