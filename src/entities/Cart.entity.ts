import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
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

  @OneToOne(() => User)
  @JoinColumn()
  @Field(() => User)
  owner!: User
}

@InputType()
export class CartUpdateInput {
  @Field()
  totalPrice!: number
}
