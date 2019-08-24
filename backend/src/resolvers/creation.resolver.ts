import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Creation } from "../entity/creation";
import { File } from "../entity/file";
import { Rating } from "../entity/rating";
import { Tag } from "../entity/tag";
import { User } from "../entity/user";
import { Context } from "./types/context";
import { CreationInput } from "./types/creation.input";
import { TagInput } from "./types/tag.input";

@Resolver(Creation)
export class CreationResolver {
  constructor(
    @InjectRepository(Creation)
    private readonly creationRepo: Repository<Creation>,
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
    @InjectRepository(Rating)
    private readonly ratingRepo: Repository<Rating>
  ) {}

  @FieldResolver(returns => Boolean)
  public async liked(@Root() creation: Creation, @Ctx() { user }: Context) {
    if (!user) { return false; }
    return !!(await this.ratingRepo.findOne({
      where: {
        user: {
          id: user.id,
        },
        creation: {
          id: creation.id,
        },
      },
    }));
  }

  @FieldResolver(returns => Int)
  public async likes(@Root() creation: Creation) {
    return await this.ratingRepo.count({ where: { creation } });
  }

  @Authorized()
  @Mutation(returns => Creation)
  public async rate(@Arg("creationId") creationId: string, @Ctx() { user }: Context) {
    const rating = await this.ratingRepo.create({
      creation: {
        id: creationId,
      },
      user: {
        id: user!.id,
      },
    });
    await this.ratingRepo.save(rating);
    return await this.creationRepo.findOneOrFail(creationId);
  }

  @Authorized()
  @Mutation(returns => Creation)
  public async removeRating(
    @Arg("creationId") creationId: string,
    @Ctx() { user }: Context
  ) {
    await this.ratingRepo.delete({
      creation: {
        id: creationId,
      },
      user,
    });
    return await this.creationRepo.findOneOrFail(creationId);
  }

  @Query(returns => Creation, { nullable: true })
  public creation(@Arg("creationId") creationId: string) {
    return this.creationRepo.findOne(creationId);
  }

  @Query(returns => [Creation])
  public creations(): Promise<Creation[]> {
    return this.creationRepo.find();
  }

  @Authorized()
  @Mutation(returns => Creation)
  public async addCreation(
    @Arg("creation")
    { name, description, status, file, pictures, tags }: CreationInput,
    @Ctx() { user: cu }: Context
  ): Promise<Creation> {
    const user = await this.userRepo.findOneOrFail(cu!.id);

    const creation = this.creationRepo.create({
      name,
      description,
      status,
      creator: user,
      file: file ? await this.fileRepo.findOne(file) : undefined,
      tags,
    });

    (await creation.pictures).push(
      ...(await this.fileRepo.findByIds(pictures))
    );

    return this.creationRepo.save(creation);
  }

  @Authorized("ADMIN")
  @Mutation(returns => Tag)
  public createTag(@Arg("tag") tag: TagInput): Promise<Tag> {
    return this.tagRepo.save(tag);
  }
}
