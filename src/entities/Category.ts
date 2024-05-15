import 'reflect-metadata'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { Picture } from './Picture'
import { ProductReference } from './ProductReference.entity'

@Entity()
@ObjectType()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number

  @Column({ length: 50, unique: true })
  @Field()
  name: string

  // index permet ordonner les catégories pour l'affichage
  @Column({})
  @Field(() => ID)
  index: number

  @Column({ default: true })
  @Field(() => Boolean, { nullable: true })
  display: boolean

  @Column({ nullable: true })
  @Field(() => ID, { nullable: true })
  createdBy: number

  @Column({ nullable: true })
  @Field(() => ID, { nullable: true })
  updatedBy: number

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field()
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
  @Field({ nullable: true })
  updatedAt!: Date

  @ManyToOne(() => Category, (category) => category.childCategories, {
    nullable: true,
  })
  @Field(() => Category, { nullable: true })
  parentCategory?: Category

  @OneToMany(() => Category, (category) => category.parentCategory, {
    cascade: true,
  })
  @Field(() => [Category], { nullable: true })
  childCategories?: Category[]

  @OneToOne(() => Picture, { nullable: true })
  @JoinColumn({ name: 'pictureId', referencedColumnName: 'id' })
  @Field(() => Picture, { nullable: true })
  picture?: Picture

  @OneToMany(
    () => ProductReference,
    (productReference) => productReference.category,
    { cascade: true }
  )
  @Field(() => [ProductReference], { nullable: true })
  productReference: ProductReference[]
}

@InputType()
export class CategoryCreateInput {
  @Field()
  name: string

  @Field(() => ID)
  index: number

  @Field(() => Boolean, { nullable: true })
  display: boolean

  @Field(() => ID)
  createdBy: number

  @Field(() => ID, { nullable: true })
  parentCategoryId: number

  // @Field(() => PictureCreateInput, { nullable: true })
  // picture?: PictureCreateInput
}

@InputType()
export class CategoryUpdateInput {
  @Field(() => ID)
  id: number

  @Field({ nullable: true })
  name?: string

  @Field(() => ID, { nullable: true })
  index?: number

  @Field(() => Boolean, { nullable: true })
  display?: boolean

  @Field(() => ID)
  updatedBy: number

  @Field(() => ID, { nullable: true })
  parentCategoryId: number
}
