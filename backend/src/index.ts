import { UserResolver } from "./resolvers/user.resolver";

// require("dotenv-safe").config();
import * as mod from "dotenv-safe";

import { ApolloServer } from "apollo-server-express";
import { S3 } from "aws-sdk";
import express from "express";
import * as jwt from "jsonwebtoken";
// import morgan from "morgan";
import net from "net";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import { createConnection, useContainer as ormUseContainer } from "typeorm";

import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import baseConfig from "../ormconfig.json";
import { authChecker } from "./auth-checker";
import { CreationResolver } from "./resolvers/creation.resolver";
import { FileResolver } from "./resolvers/file.resolver";
import { Context } from "./resolvers/types/context";
import { Middleware } from "./rest/middleware";
import { Oauth } from "./rest/oauth";
import { Upload } from "./rest/upload";
import "./types";

// register 3rd party IOC container
ormUseContainer(Container);

async function bootstrap() {
  mod.config();

  process.env.NODE_ENV = process.env.NODE_ENV || "production";
  const isProd = process.env.NODE_ENV === "production";

  Container.set(
    "s3",
    new S3({
      endpoint: process.env.S3_ENDPOINT,
      s3BucketEndpoint: true,
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY as string,
        secretAccessKey: process.env.S3_SECRET_KEY as string,
      },
    })
  );

  const ormConfig: PostgresConnectionOptions = {
    ...baseConfig,
    type: "postgres",
    logger: "advanced-console",
    logging: "all",
    synchronize: !isProd,
  };

  await createConnection(ormConfig);

  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [CreationResolver, FileResolver, UserResolver],
    authChecker,
    emitSchemaFile: "../schema.graphql",
    container: Container,
  });

  const middlewares: Middleware[] = [
    Container.get(Oauth),
    Container.get(Upload),
  ];

  const app = express();

  // app.use(morgan("combined"));
  app.use((_, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
  });

  function parseJWTHeader(authorization: string) {
    const token = authorization.replace("Bearer ", "");
    const { userId } = jwt.verify(token, process.env
      .APP_SECRET as string) as any;
    return { id: userId };
  }

  app.use((req, _, next) => {
    const authorization = req.headers.authorization || "";

    if (authorization) {
      req.user = parseJWTHeader(authorization);
    }

    next();
  });

  const server = new ApolloServer({
    schema,
    context: (req: any) => {
      const ctx: Context = {};

      if (req.req) {
        ctx.user = req.req.user;
      }

      if (
        req.connection &&
        req.connection.context &&
        req.connection.context.Authorization
      ) {
        ctx.user = parseJWTHeader(req.connection.context.Authorization);
      }

      return ctx;
    },
    uploads: false,
  });
  server.applyMiddleware({ app });
  middlewares.forEach(m => m.apply(app));

  app.use((err: Error, _: any, res: express.Response, next: (err?: any) => void) => {
    console.error((err && err.message) || err);
    if (!res.statusCode) { res.status(500); }
    if (err) {
      return res.json({
        ok: false,
        error: err.message,
      });
    }
    return next();
  });

  const http = app.listen({ port: 4000 }, () => {
    const serverInfo: any = {
      ...(http.address() as net.AddressInfo),
      server,
      subscriptionsPath: server.subscriptionsPath,
    };

    server.installSubscriptionHandlers(http);

    // Convert IPs which mean "any address" (IPv4 or IPv6) into localhost
    // corresponding loopback ip. Note that the url field we're setting is
    // primarily for consumption by our test suite. If this heuristic is
    // wrong for your use case, explicitly specify a frontend host (in the
    // `frontends.host` field in your engine config, or in the `host`
    // option to ApolloServer.listen).
    let hostForUrl = serverInfo.address;
    if (serverInfo.address === "" || serverInfo.address === "::") {
      hostForUrl = "localhost";
    }

    serverInfo.url = require("url").format({
      protocol: "http",
      hostname: hostForUrl,
      port: serverInfo.port,
      pathname: server.graphqlPath,
    });

    serverInfo.subscriptionsUrl = require("url").format({
      protocol: "ws",
      hostname: hostForUrl,
      port: serverInfo.port,
      slashes: true,
      pathname: server.subscriptionsPath,
    });

    console.log(
      `🚀 Server ready on ${serverInfo.url} [${serverInfo.subscriptionsUrl}]`
    );
  });
}

bootstrap().catch(console.error);
