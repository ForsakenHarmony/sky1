import { AuthChecker } from "type-graphql";
import { getRepository } from "typeorm";
import { User } from "./entity/user";
import { Context } from "./resolvers/types/context";

export const authChecker: AuthChecker<Context> = async (
  { context: { user } },
  roles
) => {
  if (!user) { return false; }

  const dbUser = await getRepository(User).findOneOrFail(user.id);

  if (!dbUser) { return false; }

  if (roles.length === 0) { return true; }

  return roles.includes(dbUser.role);
};
