import {
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from './User.entity'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export abstract class EntityWithDefault extends BaseEntity {
  @ManyToOne(() => User,(user) => user.createdBy, { nullable: true })
  @JoinColumn({ name: 'createdBy' })
  @Field(() => User, { nullable: true })
  createdBy!: User

  @ManyToOne(() => User, (user) => user.updatedBy, { nullable: true })
  @JoinColumn({ name: 'updatedBy' })
  @Field(() => User, { nullable: true })
  updatedBy!: User

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true })
  updatedAt!: Date
}
