import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm'
import { IsOptional, Length, IsDate } from 'class-validator'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { ProductReference } from './ProductReference.entity'
import { EntityWithDefault } from './EntityWithDefault'
import { ObjectId } from './ObjectId'

@Entity()
@ObjectType()
export class Stock extends EntityWithDefault {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column({ length: 50, nullable: true })
  @Length(2, 50, { message: 'Entre 2 et 50 caractères' })
  @Field()
  name!: string

  @Column({ default: true })
  @IsOptional()
  @Field({ nullable: true })
  isAvailable!: boolean

  @Column({ length: 50 })
  @Length(2, 50, { message: 'Entre 2 et 50 caractères' })
  @Field()
  serialNumber!: string

  @Column({ type: 'timestamp with time zone' })
  @IsOptional()
  @IsDate({ message: 'Doit être une date valide' })
  @Field(() => Date, { nullable: true })
  purchaseDataTime!: Date

  @Column({ length: 50, nullable: true })
  @IsOptional()
  @Length(2, 50, { message: 'Entre 2 et 50 caractères' })
  @Field({ nullable: true })
  supplier!: string

  @Column({ length: 50, nullable: true })
  @IsOptional()
  @Length(2, 50, { message: 'Entre 2 et 50 caractères' })
  @Field({ nullable: true })
  sku!: string

  @ManyToOne(
    () => ProductReference,
    (productReference) => productReference.stock
  )
  @JoinColumn({ name: 'productReference' })
  @Field(() => ProductReference)
  productReference!: ProductReference
}

@InputType()
export class StockCreateInput {
  @Field()
  name: string

  @Field({ nullable: true })
  isAvailable: boolean

  @Field()
  serialNumber: string

  @Field(() => Date, { nullable: true })
  purchaseDataTime: Date

  @Field({ nullable: true })
  supplier?: string

  @Field({ nullable: true })
  sku: string

  @Field()
  productReference: ObjectId
}

@InputType()
export class StockUpdateInput {
  @Field(() => ID)
  id: number

  @Field({ nullable: true })
  name: string

  @Field({ nullable: true })
  isAvailable: boolean

  @Field({ nullable: true })
  serialNumber: string

  @Field(() => Date, { nullable: true })
  purchaseDataTime: Date

  @Field({ nullable: true })
  supplier?: string

  @Field({ nullable: true })
  sku: string

  @Field({ nullable: true })
  productReference: ObjectId
}
