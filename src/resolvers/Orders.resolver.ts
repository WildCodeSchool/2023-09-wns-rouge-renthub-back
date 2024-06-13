import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { Order, OrderCreateInput } from '../entities/Order.entity'
import { MyContext } from '../types/Context.type'

@Resolver(() => Order)
export class OrdersResolver {
  @Mutation(() => Order)
  async createOrder(
    @Arg('data') data: OrderCreateInput,
    @Ctx() context: MyContext
  ): Promise<Order> {
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

    const connectedUser = context.user
    console.log('connectedUser', connectedUser)

    return newOrder
  }
}
