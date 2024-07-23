import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Field, ID, InputType, Int, ObjectType } from 'type-graphql'
import { ProductReference } from './ProductReference.entity'
import { Cart } from './Cart.entity'
import { ObjectId } from './ObjectId'
import { Min } from 'class-validator'

@Entity()
@ObjectType()
export class ProductCart extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column()
  @Field(() => Int)
  @Min(1, { message: 'Quantity must be a bigger than zero' })
  quantity!: number

  @Column({ type: 'timestamp with time zone' })
  @Field()
  dateTimeStart!: Date

  @Column({ type: 'timestamp with time zone' })
  @Field()
  dateTimeEnd!: Date

  @ManyToOne(
    () => ProductReference,
    (productReference) => productReference.productCarts
  )
  @Field(() => ProductReference)
  productReference!: ProductReference

  @ManyToOne(() => Cart, (cart) => cart.productCarts)
  @Field(() => Cart)
  cartReference!: Cart
}

@InputType()
export class ProductCartCreateInput {
  @Field(() => Int)
  @Min(1, { message: 'Quantity must be a bigger than zero' })
  quantity!: number

  @Field()
  dateTimeStart!: Date

  @Field()
  dateTimeEnd!: Date

  @Field()
  productReference!: ObjectId
}

@InputType()
export class ProductCartUpdateInput {
  @Field(() => Int, { nullable: true })
  @Min(1, { message: 'Quantity must be a bigger than zero' })
  quantity?: number

  @Field({ nullable: true })
  dateTimeStart?: Date

  @Field({ nullable: true })
  dateTimeEnd?: Date
}
