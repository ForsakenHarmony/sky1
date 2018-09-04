import { rule, shield } from 'graphql-shield';

const isAuthenticated = rule()(async (parent, args, ctx, info) => {
  return ctx.user !== null
});

export const permissions = shield({
  Query: {
    me: isAuthenticated
  },
  Mutation: {
    createCreation: isAuthenticated,
  }
});
