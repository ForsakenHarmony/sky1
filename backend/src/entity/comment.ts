import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Lazy } from "../helpers";
import { Creation } from "./creation";
import { User } from "./user";

@ObjectType()
@Entity()
export class Comment {
  @Field(type => ID)
  @PrimaryGeneratedColumn("uuid")
  public readonly id!: string;

  @Field()
  @Column()
  public text!: string;

  @Field(type => Creation)
  @ManyToOne(type => Creation, { lazy: true, nullable: false })
  public creation!: Lazy<Creation>;

  @Field(type => User)
  @ManyToOne(type => User, { lazy: true, nullable: false })
  public author!: Lazy<User>;
}
