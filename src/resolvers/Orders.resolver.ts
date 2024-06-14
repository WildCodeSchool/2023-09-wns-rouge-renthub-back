import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql'
import { Order } from '../entities/Order.entity'
import { MyContext } from '../types/Context.type'
import { CartService } from '../services/Cart.service'
import { ProductReferenceService } from '../services/ProductReference.service'
import { isRightUser } from '../utils/utils'
import { OrderService } from '../services/Order.service'

@Resolver(() => Order)
export class OrdersResolver {
  @Authorized('ADMIN', 'USER')
  @Mutation(() => Order)
  async createOrder(
    // @Arg('data') data: OrderCreateInput,
    @Ctx() context: MyContext
  ): Promise<Order> {
    // User context is missing or user is not authenticated
    if (!context.user) {
      throw new Error('User context is missing or user is not authenticated')
    }
    // Find the cart of the connected user
    const cart = await new CartService().find(+context.user.id)
    // Stock productReferencesIds
    const productReferencesIds = cart.productCarts.map(
      (productCart) => productCart.productReference.id
    )
    // Start and end date of the cart
    const dateTimeStart = cart.productCarts[0].dateTimeStart
    const dateTimeEnd = cart.productCarts[0].dateTimeEnd

    // OUch, this is a lot of code, let's break it down
    async function calculateAvailableStocks(
      productReferencesIds: number[],
      dateTimeStart: Date,
      dateTimeEnd: Date
    ) {
      for (const productReferenceId of productReferencesIds) {
        const productReference = await new ProductReferenceService().find(
          productReferenceId
        )
        const stocks = productReference.stock
        let availableStock = 0
        for (const stock of stocks) {
          const orderStocks = stock.orderStocks
          let isAvailable = true

          for (const orderStock of orderStocks) {
            if (
              !(
                dateTimeEnd <= orderStock.dateTimeStart ||
                dateTimeStart >= orderStock.dateTimeEnd
              )
            ) {
              isAvailable = false
              break
            }
          }
          if (isAvailable) {
            availableStock++
          }
        }
        console.info('availableStock', availableStock)
      }
    }
    // function calculateAvailableStocksForProduct(
    //   stocks: Stock[],
    //   dateTimeStart: Date,
    //   dateTimeEnd: Date
    // ): number {
    //   let availableStockCount = 0;

    //   for (const stock of stocks) {
    //     let isAvailable = true;

    //     for (const orderStock of stock.orderStocks) {
    //       if (
    //         !(dateTimeEnd <= orderStock.dateStart || dateTimeStart >= orderStock.dateEnd)
    //       ) {
    //         isAvailable = false;
    //         break;
    //       }
    //     }

    //     if (isAvailable) {
    //       availableStockCount++;
    //     }
    //   }

    //   return availableStockCount;
    // }
    calculateAvailableStocks(productReferencesIds, dateTimeStart, dateTimeEnd)

    const newOrder = new Order()
    // 1 = Récupérer l'id du cart via le cookie du user
    // 2 = Récupérer dans le cart :
    //  - le prix total
    //  - le tableau productCarts -> contient les id des productReferences les quantités et les dates
    // 3 = Récupérer dans productReferences :
    //  - le nombre d'ID de stock en fonction de la quantité
    //  4- Vérifier pour chaque Order Stock dans Stock la disponibilité
    //  5- Si tout est ok, création d'un Order
    //  6- Création du(des) Order Stock(s)
    //  -

    // const connectedUser = context.user
    // console.log('connectedUser', connectedUser)

    return newOrder
  }

  @Authorized('ADMIN', 'USER')
  @Query(() => Order)
  async findOrder(@Ctx() context: MyContext, @Arg('id', () => ID) id: number) {
    const isUserAuthorised = isRightUser(id, context)
    if (!isUserAuthorised)
      throw new Error('User not authorized to get this resource')

    const order = await new CartService().find(+id)

    return order
  }

  @Authorized('ADMIN')
  @Query(() => Order)
  async findOrders() {
    const orders = await new OrderService().findAll()

    return orders
  }
}
