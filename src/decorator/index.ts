import { Telegraf } from "telegraf";

export interface Bot {
  bot: Telegraf;
  launch(): void;
}

export class ConcreteBot implements Bot {
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
  component: Bot;

  constructor(component: Bot) {
    this.component = component;
    this.bot = this.component.bot;
  }

  public launch() {
    this.component.launch();
  }
}
