import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
export class Tag {
  @Field()
  @PrimaryColumn()
  public name!: string;
}
