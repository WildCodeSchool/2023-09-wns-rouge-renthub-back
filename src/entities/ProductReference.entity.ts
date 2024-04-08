import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Field, Float, ID, InputType, ObjectType } from 'type-graphql'
import { Category } from './Category'
import { PictureProduct } from './PictureProduct.entity'
import { IsBoolean, Length } from 'class-validator'
import { ObjectId } from './ObjectId'
import { EntityWithDefault } from './EntityWithDefault'
import { Stock } from './Stock.entity'

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

  @Column({ type: 'int' })
  @Field()
  index!: number

  @Column({ default: true })
  @IsBoolean()
  @Field(() => Boolean)
  display: boolean

  @Column({ length: 150 })
  @Length(2, 150)
  @Field()
  brandName!: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Field(() => Float)
  price!: number

  @ManyToOne(() => Category, (category) => category.productReference)
  @Field(() => Category, { nullable: true })
  category?: Category

  @OneToMany(
    () => PictureProduct,
    (pictureProduct) => pictureProduct.productReference,
    { cascade: true }
  )
  pictureProduct!: PictureProduct[]

  @OneToMany(() => Stock, (stock) => stock.productReference, { cascade: true, nullable: true })
  @Field(() => [Stock])
  stock!: Stock
}

@InputType()
export class ProductReferenceCreateInput {
  @Field()
  name: string

  @Field()
  description: string

  @Field(() => ID)
  index: number

  @Field(() => Boolean, { nullable: true })
  display: boolean

  @Field({ nullable: true })
  brandName?: string

  @Field(() => Float)
  price: number

  @Field()
  createdBy: ObjectId

  @Field()
  category: ObjectId
}

@InputType()
export class ProductReferenceUpdateInput {
  @Field({ nullable: true })
  updatedBy: ObjectId

  @Field()
  name: string

  @Field()
  description: string

  @Field(() => ID)
  index: number

  @Field(() => Boolean, { nullable: true })
  display: boolean

  @Field({ nullable: true })
  brandName?: string

  @Field(() => Float)
  price: number

  @Field()
  category: ObjectId
}
