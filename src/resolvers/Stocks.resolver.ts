import { Arg, ID, Mutation, Query, Resolver } from 'type-graphql'

import { Stock, StockCreateInput, StockUpdateInput } from '../entities/Stock.entity'
import { StockService } from '../services/Stock.service'

@Resolver(() => Stock)
export class StockResolver {
  @Query(() => [Stock])
  async findAllStock(): Promise<Stock[]> {
    const stocks = await new StockService().findAll()
    return stocks
  }

  @Query(() => Stock)
  async findStock(@Arg('id', () => ID) id: number) {
    const stockById = await new StockService().find(+id)
    return stockById
  }

  @Mutation(() => Stock)
  async createStock(@Arg('data') data: StockCreateInput) {
    const newStock = await new StockService().create(data)
    return newStock
  }

  @Mutation(() => Stock, { nullable: true })
  async updateStock(@Arg('data') data: StockUpdateInput) {
    const stock = await new StockService().update(data)
    return stock
  }

  @Mutation(() => Boolean, { nullable: true })
  async deleteStock(@Arg('id', () => ID) id: number) {
    const isDelete = await new StockService().delete(+id)
    return isDelete
  }
}
