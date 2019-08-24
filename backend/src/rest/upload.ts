import { S3 } from "aws-sdk";
import { Express } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { extname } from "path";
import { Container, Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { File } from "../entity/file";
import { randomHexString } from "../helpers";
import { Middleware } from "./middleware";

@Service()
export class Upload implements Middleware {
  constructor(
    @InjectRepository(File) private readonly fileRepo: Repository<File>
  ) {}

  public apply(app: Express): void {
    const s3 = Container.get<S3>("s3");

    const upload = multer({
      storage: multerS3({
        s3,
        bucket: process.env.S3_BUCKET as string,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
          const name =
            req.user.id +
              "/" +
              randomHexString(16) +
              extname(file.originalname) || ".idk";

          cb(null, name);
        },
      }),
      limits: {
        fileSize: 1024 * 4096,
        files: 1,
        fieldSize: 256,
      },
    });

    app.post(
      "/upload",
      (req, res, next) => {
        if (req.user) { return next(); }
        res.status(401);
        return next(new Error("You have to be authenticated to upload a file"));
      },
      upload.single("file"),
      async (req, res) => {
        const file = await this.fileRepo.save({
          name: req.file.originalname,
          url: (req.file as any).location,
          uploader: req.user,
        });
        res.json({
          ok: true,
          id: file.id,
          url: file.url,
        });
      }
    );
  }
}
