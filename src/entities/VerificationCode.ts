import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'
import { User } from './User'

@Entity()
@ObjectType()
export class VerificationCode extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column()
  @Field()
  type!: string

  @Column()
  @Field()
  code!: string

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true })
  expirationDate!: Date

  @ManyToOne(() => User, (user) => user.verificationCodes)
  user!: User

  @Column({ default: 0 })
  @Field()
  maximumTry!: number
}
