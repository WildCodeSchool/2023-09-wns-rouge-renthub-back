// import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
// import { Order, OrderCreateInput } from '../entities/Order.entity'
// import { MyContext } from '../types/Context.type'

// @Resolver(() => Order)
// export class OrdersResolver {
//   @Mutation(() => Order)
//   async createOrder() @Arg('data') data: OrderCreateInput,
//    @Ctx() context: MyContext
//   : Promise<Order> {
//     const newOrder = new Order()
//     // 1 = Récupérer l'id du cart à transformer en order
//     // 2 = Récupérer le cart
//     // 3 = Récupérer dans le cart :
//     //  - le prix total
//     //  - le tableau productCarts -> contient les id des productReferences les quantités et les dates
//     // 4 = Récupérer productReferences
//     // 5 = Récupérer dans productReferences :
//     //  - le nombre d'ID de stock en fonction de la quantité
//     //  -
//     //  -
//     //  -
//     //  -
//     //  -
//     return newOrder
//   }
// }
