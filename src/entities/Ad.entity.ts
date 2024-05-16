import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Field, ID, ObjectType } from "type-graphql";
import { ATestUser } from "./ATestUser.entity";

@Entity()
@ObjectType()
export class Ad extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column()
  @Field()
  title!: string;

  @ManyToOne(() => ATestUser, user => user.ads)
  @Field(() => ATestUser)
  aTestUser!: ATestUser;
}
