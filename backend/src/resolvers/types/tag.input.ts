import { Field, InputType } from "type-graphql";
import { Tag } from "../../entity/tag";

@InputType()
export class TagInput implements Partial<Tag> {
  @Field()
  public name!: string;
}
