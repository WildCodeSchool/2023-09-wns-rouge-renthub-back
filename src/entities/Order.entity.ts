import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { EntityWithDefault } from './EntityWithDefault'
import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from 'type-graphql'
import { User } from './User.entity'
import { OrderStock } from './OrderStock.entity'

export enum StatusEnum {
  CANCEL = 'CANCEL',
  INPROGRESS = 'IN PROGRESS',
  DONE = 'DONE',
}
registerEnumType(StatusEnum, {
  name: 'status',
})

@Entity()
@ObjectType()
export class Order extends EntityWithDefault {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column({
    type: 'enum',
    enum: StatusEnum,
  })
  @Field(() => StatusEnum)
  status!: StatusEnum

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user' })
  @Field(() => User, { nullable: true })
  user!: User

  @OneToMany(() => OrderStock, (orderStock) => orderStock.order)
  @Field(() => [OrderStock], { nullable: true })
  orderStocks!: OrderStock[]
}

@InputType()
export class OrderCreateInput {
  //   @Field(() => StatusEnum)
  //   status!: StatusEnum

  @Field(() => ID, { nullable: true })
  user!: number

  //   @Field(() => [ID])
  //   orderStocks!: number[]
}
