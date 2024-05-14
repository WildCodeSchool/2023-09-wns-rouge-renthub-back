import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { User } from './User'

@Entity()
@ObjectType()
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column({ default: 0 })
  @Field()
  totalPrice!: number

  @OneToOne(() => User, (user) => user.cart)
  @Field(() => User)
  owner!: User
}

@InputType()
export class CartUpdateInput {
  @Field({ nullable: true })
  totalPrice?: number
}
