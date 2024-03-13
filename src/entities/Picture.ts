import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { Category } from './Category'

@Entity()
@ObjectType()
export class Picture extends BaseEntity {
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

  @Column()
  @Field()
  filename: string

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
}

@InputType()
export class PictureCreateInput {
  @Field()
  filename: string

  @Field()
  urlHD: string

  @Field({ nullable: true })
  urlMiniature: string
}

@InputType()
export class PictureUpdate {
  @Field({ nullable: true })
  filename: string

  @Field({ nullable: true })
  urlHD: string

  @Field({ nullable: true })
  urlMiniature: string
}
