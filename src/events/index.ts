import { DecoratorBot } from "../decorator";
import { documentEvent } from "./document";

export class BotWithEvents extends DecoratorBot {
  private setEvents(bot) {
    bot.on("document", documentEvent);
    bot.on("sticker", (ctx: any) => ctx.reply("👍"));
  }

  public launch() {
    this.setEvents(this.bot);
    super.launch();
  }
}
