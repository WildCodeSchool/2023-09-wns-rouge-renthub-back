import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Field, ID, Int, ObjectType } from 'type-graphql'
import { User } from './User.entity'

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

  @ManyToOne(() => User, (user) => user.verificationCodes, { onDelete: 'CASCADE' })
  user!: User

  @Column({ default: 0 })
  @Field(() => Int)
  maximumTry!: number
}
