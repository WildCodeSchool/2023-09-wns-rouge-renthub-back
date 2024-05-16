import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import {
  Field,
  ID,
  ObjectType,
} from "type-graphql";
import { Ad } from "./Ad.entity";

@Entity()
@ObjectType()
export class ATestUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column()
  @Field()
  email!: string;

  @OneToMany(() => Ad, (ad) => ad.aTestUser)
  @Field(() => [Ad])
  ads!: Ad[];
}