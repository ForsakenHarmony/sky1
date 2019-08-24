import { IsEmail } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Lazy } from "../helpers";
import { Creation } from "./creation";
import { Role } from "./enums";

@ObjectType()
@Entity()
export class User {
  @Field(type => ID)
  @PrimaryColumn()
  public id!: string;

  @Field()
  @Column()
  public username!: string;

  @IsEmail()
  @Column()
  public email!: string;

  @Field()
  @Column()
  public avatar!: string;

  @Field(type => [Creation])
  @OneToMany(type => Creation, crea => crea.creator, {
    lazy: true,
    cascade: ["insert", "remove"],
  })
  public creations!: Lazy<[Creation]>;

  @Field(type => Role)
  @Column({ default: Role.User })
  public role!: Role;

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  // should the update time be exposed?
  // @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;
}
