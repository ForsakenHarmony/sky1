import { Resolvers } from '../../index';

const Query: Resolvers = {
  creations(src, args, ctx, info) {
    return ctx.db.query.creations({ orderBy: 'createdAt_DESC' }, info);
  },
};

export default Query;

