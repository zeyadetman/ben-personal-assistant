import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import { Octokit } from "octokit";
import { BotWithCommands } from "./commands";
import { ConcreteBot, DecoratorBot } from "./decorator";
import { BotWithEvents } from "./events";
dotenv.config();

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

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

const simple = new ConcreteBot(new Telegraf(process.env.BOT_TOKEN));
const botWithEvents = new BotWithEvents(simple);
const botWithCommands = new BotWithCommands(botWithEvents);

botWithCommands.launch();
