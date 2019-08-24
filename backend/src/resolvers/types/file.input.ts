import { Field, InputType } from "type-graphql";
import { File } from "../../entity/file";

@InputType()
export class FileInput implements Partial<File> {
  @Field()
  public name!: string;

  @Field()
  public url!: string;
}
