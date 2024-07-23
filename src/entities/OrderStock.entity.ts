import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'
import { IsDate } from 'class-validator'
import { Order } from './Order.entity'
import { Stock } from './Stock.entity'
import { EntityWithDefault } from './EntityWithDefault'

@Entity()
@ObjectType()
export class OrderStock extends EntityWithDefault {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column({ type: 'timestamp with time zone', nullable: true })
  @IsDate({ message: 'Doit être une date valide' })
  @Field(() => Date)
  dateTimeStart!: Date

  @Column({ type: 'timestamp with time zone', nullable: true })
  @IsDate({ message: 'Doit être une date valide' })
  @Field(() => Date)
  dateTimeEnd!: Date

  @ManyToOne(() => Order, (order) => order.orderStocks)
  @Field(() => Order)
  order!: Order

  @ManyToOne(() => Stock, (stock) => stock.orderStocks)
  @Field(() => Stock)
  stock!: Stock
}
