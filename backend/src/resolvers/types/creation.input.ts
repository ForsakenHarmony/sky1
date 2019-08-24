import { Field, InputType } from "type-graphql";
import { Status } from "../../entity/enums";
import { TagInput } from "./tag.input";

@InputType()
export class CreationInput {
  @Field()
  public name!: string;

  @Field()
  public description!: string;

  @Field(type => Status)
  public status!: Status;

  @Field(type => [TagInput])
  public tags!: [TagInput];

  @Field({ nullable: true })
  public file?: string;

  @Field(type => [String])
  public pictures!: [string];
}
