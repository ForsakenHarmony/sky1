import { Field, ObjectType } from "type-graphql";
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm";

import { Lazy } from "../helpers";
import { Creation } from "./creation";
import { User } from "./user";

@ObjectType()
@Entity()
export class Rating {
  // @Field(type => Int)
  // @Column({ type: "int" })
  // value!: number;

  @Field(type => User)
  @ManyToOne(type => User, { lazy: true, primary: true })
  public user!: Lazy<User>;

  @Field(type => Creation)
  @ManyToOne(type => Creation, { lazy: true, primary: true })
  public creation!: Lazy<Creation>;

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;
}
