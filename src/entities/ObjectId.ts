import { Field, ID, InputType } from "type-graphql";

@InputType()
export class ObjectId {
  @Field(() => ID)
  id!: number;
}
