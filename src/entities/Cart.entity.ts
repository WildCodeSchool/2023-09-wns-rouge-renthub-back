import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Field, ID, InputType, Int, ObjectType } from 'type-graphql'
import { User } from './User'
import { ProductCart } from './ProductCart.entity'

@Entity()
@ObjectType()
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column({ default: 0 })
  @Field(() => Int)
  totalPrice!: number

  @OneToOne(() => User, (user) => user.cart)
  @Field(() => User)
  owner!: User

  @OneToMany(() => ProductCart, (productCart) => productCart.cartReference, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [ProductCart], { nullable: true })
  productCart!: ProductCart[]
}

@InputType()
export class CartUpdateInput {
  @Field(() => Int, { nullable: true })
  totalPrice?: number
}
