import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm'
import {
  IsEmail,
  IsNumberString,
  IsOptional,
  Length,
  Matches,
  IsDate,
} from 'class-validator'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { Picture } from './Picture'
import { Role } from './Role'
import { ObjectId } from './ObjectId'
import { VerificationCode } from './VerificationCode'

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number

  @Column({ length: 50, nullable: true })
  @IsOptional()
  @Length(2, 50, { message: 'Entre 2 et 50 caractères' })
  @Matches(/^[a-zA-ZÀ-ÿ-]+$/, {
    message: 'Le prénom ne doit contenir que des lettres',
  })
  @Field({ nullable: true })
  firstName!: string

  @Column({ length: 50, nullable: true })
  @IsOptional()
  @Length(2, 50, { message: 'Entre 2 et 50 caractères' })
  @Matches(/^[a-zA-ZÀ-ÿ-]+$/, {
    message: 'Le nom de famille ne doit contenir que des lettres',
  })
  @Field({ nullable: true })
  lastName!: string

  @Column({ length: 50, nullable: true })
  @IsOptional()
  @Length(2, 50, { message: 'Entre 2 et 50 caractères' })
  @Field({ nullable: true })
  nickName!: string

  @Column({ type: 'date', nullable: true })
  @IsOptional()
  @IsDate({ message: 'Doit être une date valide' })
  @Field(() => Date, { nullable: true })
  dateOfBirth!: Date

  @Column({ length: 250 })
  hashedPassword!: string

  @Column({ length: 10, nullable: true })
  @IsOptional()
  @IsNumberString(
    {},
    { message: 'Le numéro de téléphone doit être une chaîne de chiffres' }
  )
  @Length(10, 10, {
    message: 'Le numéro de téléphone doit avoir exactement 10 chiffres',
  })
  @Field({ nullable: true })
  phoneNumber!: string

  @Column({ length: 255, unique: true })
  @Field()
  @IsEmail()
  email!: string

  @Column({ default: false })
  @Field()
  isVerified!: boolean

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true })
  lastConnectionDate!: Date

  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date)
  createdAt!: Date

  @ManyToOne(() => User, (user) => user.createdBy)
  @Field(() => User, { nullable: true })
  createdBy!: User

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt!: Date

  @ManyToOne(() => User, (user) => user.updatedBy, { nullable: true })
  @Field(() => User, { nullable: true })
  updatedBy!: User

  @OneToOne(() => Picture, { nullable: true })
  @IsOptional()
  @JoinColumn()
  @Field({ nullable: true })
  picture?: Picture

  @OneToMany(
    () => VerificationCode,
    (verificationCode) => verificationCode.user,
    { cascade: true }
  )
  verificationCodes!: VerificationCode[]

  @ManyToOne(() => Role, (role) => role.user)
  @JoinColumn({ name: 'role' })
  @Field(() => Role, { nullable: true })
  role!: Role
}

@InputType()
export class UserCreateInput {
  @Field({ nullable: true })
  firstName!: string

  @Field({ nullable: true })
  lastName!: string

  @Field({ nullable: true })
  nickName!: string

  @Field({ nullable: true })
  dateOfBirth!: string

  @Field()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+]{8,}$/, {
    message:
      'Password is not valid. At least 8 characters, 1 uppercase, 1 lowercase, 1 special characters and 1 number required!',
  })
  password!: string

  @Field({ nullable: true })
  phoneNumber?: string

  @Field()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Email is not valid!',
  })
  email!: string

  @Field({ nullable: true })
  pictureId?: ObjectId
}

@InputType()
export class UserUpdateInput {
  @Field({ nullable: true })
  firstName!: string

  @Field({ nullable: true })
  lastName!: string

  @Field({ nullable: true })
  nickName!: string

  @Field({ nullable: true })
  dateOfBirth!: Date

  @Field({ nullable: true })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
  password!: string

  @Field({ nullable: true })
  phoneNumber!: string

  @Field({ nullable: true })
  isVerified!: boolean

  @Field(() => ID, { nullable: true })
  updatedBy?: number

  @Field({ nullable: true })
  pictureId?: number
}

@InputType()
export class UserLoginInput {
  @Field()
  email!: string

  @Field()
  password!: string
}

@ObjectType()
export class UserContext {
  @Field()
  id!: number

  @Field()
  nickName!: string

  @Field()
  picture!: string
}

@ObjectType()
export class VerifyEmailResponse {
  @Field()
  success!: boolean

  @Field({ nullable: true })
  message?: string
}
