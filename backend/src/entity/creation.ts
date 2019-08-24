import { Length } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Lazy } from "../helpers";
import { Comment } from "./comment";
import { Status } from "./enums";
import { File } from "./file";
import { Rating } from "./rating";
import { Tag } from "./tag";
import { User } from "./user";

@ObjectType()
@Entity()
export class Creation {
  @Field(type => ID)
  @PrimaryGeneratedColumn("uuid")
  public readonly id!: string;

  @Length(3, 30)
  @Field()
  @Column()
  public name!: string;

  @Length(10, 150)
  @Field()
  @Column()
  public description!: string;

  @Field(type => Status)
  @Column()
  public status!: Status;

  @Field(type => [Tag])
  @ManyToMany(type => Tag, { lazy: true })
  @JoinTable()
  public tags!: Lazy<[Tag]>;

  @Field(type => File, { nullable: true })
  @OneToOne(type => File, { lazy: true, nullable: true })
  @JoinColumn()
  public file?: Lazy<File>;

  @Field(type => [File])
  @ManyToMany(type => File, { lazy: true, cascade: true })
  @JoinTable()
  public pictures!: Lazy<[File]>;

  @Field(type => [Rating])
  @OneToMany(type => Rating, rate => rate.creation, {
    lazy: true,
    cascade: true,
  })
  public ratings!: Lazy<Rating[]>;

  @Field(type => [Comment])
  @OneToMany(type => Comment, comment => comment.creation, {
    lazy: true,
    cascade: true,
  })
  public comments!: Lazy<Comment[]>;

  @Field(type => User)
  @ManyToOne(type => User, { lazy: true, nullable: false })
  public creator!: Lazy<User>;

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;
}
