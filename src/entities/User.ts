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
} from "typeorm";
import {
  IsEmail,
  IsNumberString,
  IsOptional,
  Length,
  Matches,
  IsDate,
} from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Picture } from "./Picture";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column({ length: 50 })
  @Length(2, 50, { message: "Entre 2 et 50 caractères" })
  @Matches(/^[a-zA-ZÀ-ÿ-]+$/, {
    message: "Le prénom ne doit contenir que des lettres",
  })
  @Field()
  firstName!: string;

  @Column({ length: 50 })
  @Length(2, 50, { message: "Entre 2 et 50 caractères" })
  @Matches(/^[a-zA-ZÀ-ÿ-]+$/, {
    message: "Le nom de famille ne doit contenir que des lettres",
  })
  @Field()
  lastName!: string;

  @Column({ length: 50, nullable: true })
  @Length(2, 50, { message: "Entre 2 et 50 caractères" })
  @Field({ nullable: true })
  nickName!: string;

  @Column({ type: "date" })
  @IsDate({ message: "Doit être une date valide" })
  @Field(() => Date)
  dateOfBirth!: Date;

  @Column({ length: 250 })
  hashedPassword!: string;

  @Column({ length: 10, nullable: true })
  @IsOptional()
  @IsNumberString(
    {},
    { message: "Le numéro de téléphone doit être une chaîne de chiffres" }
  )
  @Length(10, 10, {
    message: "Le numéro de téléphone doit avoir exactement 10 chiffres",
  })
  @Field({ nullable: true })
  phoneNumber!: string;

  @Column({ length: 255, unique: true })
  @Field()
  @IsEmail()
  email!: string;

  @Column({ default: false })
  isVerified!: boolean;

  @Column({ type: "timestamp" })
  @Field(() => Date)
  lastConnectionDate!: Date;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.createdBy)
  @Field(() => User)
  createdBy!: User;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.updatedBy)
  @Field(() => User)
  updatedBy!: User;

  @OneToOne(() => Picture, { nullable: true })
  @JoinColumn()
  @Field({ nullable: true })
  picture?: Picture;
}

@InputType()
export class UserCreateInput {
  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  nickName!: string;

  @Field()
  dateOfBirth!: Date;

  @Field()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
  password!: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field()
  email!: string;

  @Field()
  isVerified!: boolean;

  @Field(() => ID)
  createdBy?: number;

  @Field(() => ID)
  updatedBy?: number;

  @Field({ nullable: true })
  pictureId?: number;
}

@InputType()
export class UserUpdateInput {
  @Field({ nullable: true })
  firstName!: string;

  @Field({ nullable: true })
  lastName!: string;

  @Field({ nullable: true })
  nickName!: string;

  @Field({ nullable: true })
  dateOfBirth!: Date;

  @Field({ nullable: true })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
  password!: string;

  @Field({ nullable: true })
  phoneNumber!: string;

  @Field({ nullable: true })
  isVerified!: boolean;

  @Field(() => ID, { nullable: true })
  updatedBy?: number;

  @Field({ nullable: true })
  pictureId?: number;
}

@InputType()
export class UserLoginInput {
  @Field()
  email!: string;

  @Field()
  password!: string;
}

@ObjectType()
export class UserContext {
  @Field()
  id!: number;

  @Field()
  nickName!: string;

  @Field()
  picture!: string;
}

@ObjectType()
export class VerifyEmailResponse {
  @Field()
  success!: boolean;

  @Field({ nullable: true })
  message?: string;
}
