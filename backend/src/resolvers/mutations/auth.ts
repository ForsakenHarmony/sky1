import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { stringify } from 'querystring';
import { Resolvers } from '../../index';

type DiscordUser = {
  username: string;
  id: string;
  avatar: string;
  email: string;
};

async function getDiscordUser(token: string): Promise<DiscordUser> {
  try {
    const {
      data: { access_token },
    } = await axios.post<{ access_token: string }>(
      'https://discordapp.com/api/v6/oauth2/token',
      stringify({
        code: token,
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        redirect_uri: 'http://localhost:8080/',
        grant_type: 'authorization_code',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { data: user } = await axios.get<DiscordUser>(
      'https://discordapp.com/api/v6/users/@me',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    user.avatar = `https://cdn.discordapp.com/avatars/${user.id}/${
      user.avatar
    }`;

    return user;
  } catch (e) {
    throw new Error('Could not parse discord token');
  }
}

const Auth: Resolvers = {
  async login(src, { token }, ctx) {
    const user = await getDiscordUser(token);

    const { id: discord_id, email, avatar, username } = user;

    const { id } = await ctx.db.mutation.upsertUser(
      {
        where: {
          discord_id,
        },
        create: {
          username,
          avatar,
          discord_id,
          email,
          role: 'USER',
        },
        update: {
          email,
          avatar,
          username,
        },
      },
      `{ id }`
    );

    return {
      token: jwt.sign({ userId: id }, process.env.APP_SECRET, {
        expiresIn: 60 * 60 * 24 /* seconds to expire in (24 hrs) */,
      }),
      user: { id },
    };
  },
};

export default Auth;
