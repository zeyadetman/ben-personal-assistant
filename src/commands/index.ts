import { Markup } from "telegraf";
import { DecoratorBot } from "../decorator";
import { REQUEST_IMDB_EXPORTED_FILE_MESSAGE } from "../utils/constants";
import { convertTitleToFileName } from "../utils/convert-name";
import { writeFileToGithub } from "../utils/writeFileToGithub";
import { help } from "./help";
import { start } from "./start";
import { getDataWithRate, syncIMDB } from "./syncIMDB";
import { syncNotion } from "./syncNotion";

export class BotWithCommands extends DecoratorBot {
  private setCommands(bot) {
    bot.hears("hi", (ctx: any) => ctx.reply("Hey there"));
    bot.command("syncIMDB", syncIMDB);
    bot.command("syncNotion", syncNotion);

    bot.start(start);
    bot.help(help);
    bot.on("sticker", (ctx: any) => ctx.reply("👍"));
  }

  public launch() {
    this.setCommands(this.bot);
    super.launch();
  }
}
