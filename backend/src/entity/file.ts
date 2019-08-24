import { Field, ID, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Lazy } from "../helpers";
import { User } from "./user";

@ObjectType()
@Entity()
export class File {
  @Field(type => ID)
  @PrimaryGeneratedColumn("uuid")
  public readonly id!: string;

  @Field()
  @Column()
  public name!: string;

  @Field()
  @Column()
  public url!: string;

  @Field(type => User, { nullable: true })
  @ManyToOne(type => User, { lazy: true, nullable: true })
  public uploader!: Lazy<User>;

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;
}
