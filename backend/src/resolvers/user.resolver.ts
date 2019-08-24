import { Arg, Authorized, Ctx, Query, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../entity/user";
import { Context } from "./types/context";

@Resolver(User)
export class UserResolver {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {}

  @Authorized()
  @Query(returns => User)
  public me(@Ctx() { user }: Context) {
    if (!user) { throw new Error("You're not logged in"); }

    return this.userRepo.findOne(user.id);
  }

  @Query(returns => User, { nullable: true })
  public user(@Arg("userId") userId: string) {
    return this.userRepo.findOne(userId);
  }
}
