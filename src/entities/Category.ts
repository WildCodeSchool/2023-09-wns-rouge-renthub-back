import 'reflect-metadata'
import {
  BeforeInsert,
  BeforeUpdate,
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

@Entity()
@ObjectType()
export class Category {

  @BeforeInsert()
  updateDatesOnInsert() {
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  @BeforeUpdate()
  updateDatesOnUpdate() {
    this.updatedAt = new Date()
  }

  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number

  @Column({ length: 50 })
  @Field()
  name: string

  // index permet ordonner les catégories pour l'affichage
  @Column({})
  @Field(() => ID, { nullable: true })
  index: number

  @Column({ default: true })
  @Field(() => Boolean, { nullable: true })
  display: boolean

  @Column({ nullable: true })
  @Field({ nullable: true })
  createdBy: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  updatedBy: string

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Field()
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
  @Field({ nullable: true })
  updatedAt!: Date

  @ManyToOne(() => Category, (category) => category.childCategories)
  @Field(() => Category, { nullable: true })
  parentCategory?: Category

  @OneToMany(() => Category, (category) => category.parentCategory)
  @Field(() => [Category], { nullable: true })
  childCategories?: Category[]

  @OneToOne(() => Picture)
  @JoinColumn({ name: 'pictureId', referencedColumnName: 'id' }) // Vous pouvez spécifier des options dans JoinColumn si nécessaire
  @Field(() => Picture, { nullable: true })
  picture?: Picture // Utilisation de ? pour indiquer qu'il est facultatif
}

@InputType()
export class CategoryInput {
  @Field()
  name: string

  @Field(() => ID, { nullable: true })
  index: number

  @Field(() => Boolean, { nullable: true })
  display: boolean

  @Field()
  createdBy: string

  @Field(() => ID, { nullable: true })
  parentCategoryId: number
}
