import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { Category } from './Category.entity'
import { ProductReference } from './ProductReference.entity'

@Entity()
@ObjectType()
export class Picture extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number

  @Column()
  @Field()
  name: string

  @Field()
  get uri(): string {
    return `/api/images/${this.id}`
  }

  @Column({ nullable: true })
  @Field({ nullable: true })
  mimetype: string

  @Column({ nullable: true })
  //@Field({ nullable: true }) -- dont expose this path in graphql
  path: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  urlHD: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  urlMiniature: string

  @Column()
  @Field(() => ID)
  createdBy: number

  @Column({ nullable: true })
  @Field(() => ID, { nullable: true })
  updatedBy: number

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field()
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
  @Field({ nullable: true })
  updatedAt?: Date

  @OneToOne(() => Category, (category) => category.picture)
  @Field(() => Category, { nullable: true })
  category: Category

  @ManyToOne(
    () => ProductReference,
    (productReference) => productReference.picture
  )
  @Field(() => ProductReference)
  productReference: ProductReference
}

@InputType()
export class PictureCreateInput {
  @Field()
  name: string

  @Field()
  urlHD: string

  @Field({ nullable: true })
  urlMiniature: string
}

@InputType()
export class PictureUpdate {
  @Field({ nullable: true })
  name: string

  @Field({ nullable: true })
  urlHD: string

  @Field({ nullable: true })
  urlMiniature: string
}
