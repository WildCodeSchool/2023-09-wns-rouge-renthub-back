import {
  Arg,
  Authorized,
  ID,
  Mutation,
  Resolver,
} from 'type-graphql'
import { Order } from '../entities/Order.entity'
import { OrderStockService } from '../services/OrderStock.service'

@Resolver(() => Order)
export class OrderStocksResolver {
  @Authorized('ADMIN')
  @Mutation(() => [Order])
  async deleteOrderStockById(@Arg('id', () => ID) id: number) {
    const orderStock = await new OrderStockService().deleteById(id)
    return orderStock
  }
}
