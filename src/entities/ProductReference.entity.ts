import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Field, ID, InputType, Int, ObjectType } from 'type-graphql'
import { Category } from './Category.entity'
import { IsBoolean, Length } from 'class-validator'
import { ObjectId } from './ObjectId'
import { EntityWithDefault } from './EntityWithDefault'
import { Stock } from './Stock.entity'
import { ProductCart } from './ProductCart.entity'
import { Picture } from './Picture.entity'

@Entity()
@ObjectType()
export class ProductReference extends EntityWithDefault {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column({ length: 150 })
  @Length(2, 150)
  @Field()
  name!: string

  @Column({ type: 'text' })
  @Length(10, 5000)
  @Field()
  description!: string

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  index!: number

  @Column({ default: true })
  @IsBoolean()
  @Field(() => Boolean)
  display: boolean

  @Column({ length: 150 })
  @Length(2, 150)
  @Field()
  brandName!: string

  @Column()
  @Field(() => Int)
  price!: number

  @ManyToOne(() => Category, (category) => category.productReferences)
  @Field(() => Category)
  category?: Category

  @OneToMany(() => Stock, (stock) => stock.productReference, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [Stock], { nullable: true })
  stock!: Stock[]

  @OneToMany(() => ProductCart, (productCart) => productCart.productReference)
  @Field(() => [ProductCart])
  productCarts!: ProductCart[]

  @OneToMany(() => Picture, (picture) => picture.productReference)
  @Field(() => [Picture])
  picture!: Picture[]
}

@InputType()
export class ProductReferenceCreateInput {
  @Field()
  name: string

  @Field()
  description: string

  @Field(() => Int, { nullable: true })
  index?: number

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  display: boolean

  @Field({ nullable: true })
  brandName?: string

  @Field(() => Int)
  price: number

  @Field()
  category: ObjectId

  @Field()
  picture: ObjectId
}

@InputType()
export class ProductReferenceUpdateInput {
  @Field({ nullable: true })
  updatedBy: ObjectId

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field(() => Int, { nullable: true })
  index?: number

  @Field(() => Boolean, { nullable: true })
  display?: boolean

  @Field({ nullable: true })
  brandName?: string

  @Field(() => Int, { nullable: true })
  price?: number

  @Field({ nullable: true })
  category?: ObjectId
}
