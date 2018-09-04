require('dotenv-safe').config();

import { importSchema } from 'graphql-import';
import { ApolloServer } from './server';
import { gql, IFieldResolver, makeExecutableSchema } from 'apollo-server';

import { applyMiddleware } from 'graphql-middleware';

import * as B2 from 'backblaze-b2';
import * as jwt from 'jsonwebtoken';

import { Prisma } from './generated/prisma';
import resolvers from './resolvers';
import { permissions } from './permissions';

const prisma = new Prisma({
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: true,
});

const b2 = new B2({
  accountId: process.env.B2_ACCOUNT_ID,
  applicationKey: process.env.B2_APPLICATION_KEY,
});

const b2_prom = b2.authorize().then(() => b2);

const typeDefs = gql(importSchema('src/schema.graphql'));

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export type Context = {
  req: any;
  db: Prisma;
  b2: B2;
  user: {
    id: string;
  };
};

export type Resolvers = { [key: string]: IFieldResolver<any, Context> };

function getUser(ctx) {
  const authorization = ctx.req.headers.authorization || '';

  if (authorization) {
    const token = authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    return { id: userId };
  }
}

const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context: async ctx => ({
    ...ctx,
    user: getUser(ctx),
    db: prisma,
    b2: await b2_prom,
  }),
  uploads: {
    maxFiles: 5,
    maxFileSize: 2 * 1024 * 1024,
  },
});

server.listen().then(({ url }) => console.log(`🚀  Server ready at ${url}`));
