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
import { User } from './User.entity'

@Entity()
@ObjectType()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column({ length: 50, unique: true})
  @Length(2, 50, { message: 'Entre 2 et 50 caractères' })
  @Matches(/^[a-zA-ZÀ-ÿ0-9-]+$/, {
    message:
      'Le nom du groupe Role peut contenir des lettres, des chiffres et des tirets',
  })
  @Field()
  name!: string

  @Column({
    type: 'enum',
    enum: ['ADMIN', 'USER'],
    default: 'USER',
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

@InputType()
export class RoleUpdateInput {
  @Field({ nullable: true })
  name!: string

  @Field({ nullable: true })
  right!: string
}
