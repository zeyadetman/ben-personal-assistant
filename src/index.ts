import { Telegraf, Types } from "telegraf";
import * as dotenv from "dotenv";
import { start } from "./commands/start";
import { help } from "./commands/help";
import { getMoviesWithRate, writeFileToGithub } from "./commands/syncMovies";
import { Octokit } from "octokit";
dotenv.config();

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

interface Bot {
  bot: Telegraf;
  launch(): void;
}

class ConcreteBot implements Bot {
  bot: Telegraf;

  constructor(bot: Telegraf) {
    this.bot = bot;
  }

  public launch() {
    this.bot.launch();
  }
}

export class DecoratorBot implements Bot {
  bot: Telegraf;

  constructor(bot: Telegraf) {
    this.bot = bot;
  }

  public launch() {
    this.bot.launch();
  }
}

class BotWithCommands extends DecoratorBot {
  private setCommands() {
    this.bot.hears("hi", (ctx: any) => ctx.reply("Hey there"));
    this.bot.command("syncMovies", (ctx: any) => {
      ctx.replay;
    });
    this.bot.on("document", async (ctx: any) => {
      const moviesWithRate = await getMoviesWithRate(ctx);
      await writeFileToGithub(moviesWithRate);
      console.log({ moviesWithRate });
      ctx.reply("done! 🎉");
    });
    this.bot.start(start);
    this.bot.help(help);
    this.bot.on("sticker", (ctx: any) => ctx.reply("👍"));
  }

  public launch() {
    this.setCommands();
    super.launch();
  }
}

class BotWithStop extends DecoratorBot {
  private enableGracefulStop() {
    process.once("SIGINT", () => this.bot.stop("SIGINT"));
    process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
  }

  public launch() {
    this.enableGracefulStop();
    super.launch();
  }
}

const bot = new BotWithCommands(new Telegraf(process.env.BOT_TOKEN || ""));

bot.launch();
