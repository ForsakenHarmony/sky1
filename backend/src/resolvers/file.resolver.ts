import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { File } from "../entity/file";
import { Context } from "./types/context";
import { FileInput } from "./types/file.input";

@Resolver(File)
export class FileResolver {
  constructor(
    @InjectRepository(File) private readonly fileRepo: Repository<File>
  ) {}

  @Authorized("ADMIN")
  @Query(returns => [File])
  public files(): Promise<File[]> {
    return this.fileRepo.find();
  }

  @Query(returns => File, { nullable: true })
  public file(@Arg("fileId") fileId: string) {
    return this.fileRepo.findOne(fileId);
  }

  @Authorized("ADMIN")
  @Mutation(returns => File)
  public addFile(
    @Arg("file", type => FileInput) file: FileInput,
    @Ctx() { user }: Context
  ): Promise<File> {
    return this.fileRepo.save({
      ...file,
      uploader: user,
    });
  }
}
