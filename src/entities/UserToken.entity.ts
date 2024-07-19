import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './User.entity'
import { Field, ID, ObjectType } from 'type-graphql'

@Entity()
@ObjectType()
export class UserToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column()
  token!: string

  @ManyToOne(() => User)
  user!: User

  @Field()
  expiresAt!: Date

  @CreateDateColumn()
  createdAt!: Date
}
