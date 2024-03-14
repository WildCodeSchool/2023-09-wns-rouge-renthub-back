import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Field, Float, ID, InputType, ObjectType } from 'type-graphql'
import { Category } from './Category'
import { PictureProduct } from './PictureProduct.entity'
import { IsBoolean, IsInt, Length } from 'class-validator'
import { ObjectId } from './ObjectId'

@Entity()
@ObjectType()
export class ProductReference extends BaseEntity {
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

  @Column({ nullable: true })
  @Field({ nullable: true })
  createdBy?: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  updatedBy?: string

  @CreateDateColumn({ type: 'timestamp' })
  @Field()
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  updatedAt!: Date

  @ManyToOne(() => Category, (category) => category.productReference)
  @Field(() => Category, { nullable: true })
  category?: Category

  @OneToMany(
    () => PictureProduct,
    (pictureProduct) => pictureProduct.productReference,
    { cascade: true }
  )
  pictureProduct!: PictureProduct[]
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
  createdBy: string

  @Field()
  category: ObjectId
}

@InputType()
export class ProductReferenceUpdateInput extends ProductReferenceCreateInput {
  @Field(() => ID)
  id: number

  @Field({ nullable: true })
  updatedBy: string
}
