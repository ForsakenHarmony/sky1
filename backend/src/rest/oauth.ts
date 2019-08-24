import axios from "axios";
import { randomBytes } from "crypto";
import { Express, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { stringify } from "querystring";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../entity/user";
import { Middleware } from "./middleware";

interface DiscordUser {
  username: string;
  id: string;
  avatar: string;
  email: string;
}

@Service()
export class Oauth implements Middleware {
  private stateCache: string[] = [];

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {}

  public stateError(_: Request, res: Response) {
    res.status(401).send(`
      <main>
        <h1>Invalid state token (timeout during authentication?)</h1>
        <p><a href="/api/oauth">Try again?</a></p>
        <p><a href="/">Back to Home</a></p>
      </main>
    `);
  }

  public redirect(_: Request, res: Response) {
    const state = randomBytes(8)
      .toString("hex")
      .slice(0, 16);
    this.stateCache.push(state);

    const search = stringify({
      client_id: process.env.DISCORD_CLIENT_ID,
      redirect_uri: process.env.DISCORD_REDIRECT,
      response_type: "code",
      scope: "identify email",
      state,
    });

    res.redirect(`https://discordapp.com/api/oauth2/authorize?${search}`);
  }

  public async callback(req: Request, res: Response) {
    const idx = this.stateCache.indexOf(req.query.state);
    // error
    if (idx === -1) { return this.stateError(req, res); }
    this.stateCache.splice(idx, 1);

    const code = req.query.code;
    const [discordUser, expiresIn] = await this.getDiscordUser(code);
    const user = await this.userRepo.save(discordUser);

    const token = jwt.sign(
      { userId: user.id },
      process.env.APP_SECRET as string,
      {
        expiresIn /* seconds to expire in, just copy it from discord */,
      }
    );

    res.send(
      `<script>window.localStorage.setItem("jwt", ${JSON.stringify(
        token
      )});window.location.href="/"</script>`
    );
  }

  public apply(app: Express): void {
    app.get("/oauth", this.redirect.bind(this));
    app.get("/oauth/redirect", this.callback.bind(this));
  }

  public async getDiscordUser(code: string): Promise<[User, number]> {
    try {
      const {
        data: { access_token, expires_in },
      } = await axios.post<{ access_token: string; expires_in: number }>(
        "https://discordapp.com/api/v6/oauth2/token",
        stringify({
          code,
          client_id: process.env.DISCORD_CLIENT_ID,
          client_secret: process.env.DISCORD_CLIENT_SECRET,
          redirect_uri: process.env.DISCORD_REDIRECT,
          grant_type: "authorization_code",
          scope: "identify email",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const {
        data: { id, avatar, email, username },
      } = await axios.get<DiscordUser>(
        "https://discordapp.com/api/v6/users/@me",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      return [
        this.userRepo.create({
          avatar: `https://cdn.discordapp.com/avatars/${id}/${avatar}`,
          email,
          id,
          username,
        }),
        expires_in,
      ];
    } catch (e) {
      throw new Error("Could not parse discord token");
    }
  }
}
