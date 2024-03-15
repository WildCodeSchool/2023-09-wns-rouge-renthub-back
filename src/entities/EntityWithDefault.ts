import {
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from './User'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export abstract class EntityWithDefault extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  @Field(() => User, { nullable: true })
  createdBy!: User

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updatedBy' })
  @Field(() => User, { nullable: true })
  updatedBy!: User

  @CreateDateColumn({ type: 'timestamp' })
  @Field()
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  updatedAt!: Date
}
