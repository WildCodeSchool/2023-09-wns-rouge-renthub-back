import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { Length, Matches } from 'class-validator'
import { User } from './User'

@Entity()
@ObjectType()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column({ length: 50 })
  @Length(2, 50, { message: 'Entre 2 et 50 caractères' })
  @Matches(/^[a-zA-ZÀ-ÿ-]+$/, {
    message: 'Le prénom ne doit contenir que des lettres',
  })
  @Field()
  name!: string

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
    default: 'user',
  })
  @Field()
  right!: string

  @CreateDateColumn()
  @Field()
  createdAt!: Date

  @OneToMany(() => User, (user) => user.role)
  @Field(() => [User])
  user!: User

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt!: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  @Field(() => User, { nullable: true })
  createdBy!: User

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updatedBy' })
  @Field(() => User, { nullable: true })
  updatedBy!: User
}

@InputType()
export class RoleCreateInput {
  @Field()
  name!: string

  @Field()
  right!: string
}
