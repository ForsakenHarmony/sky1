import { Resolvers } from '../../index';

const AuthPayload: Resolvers = {
  async user({ user: { id } }, args, ctx, info) {
    return ctx.db.query.user({ where: { id } }, info);
  },
};

export default AuthPayload;
