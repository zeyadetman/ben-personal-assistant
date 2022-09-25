import { getDataWithRate } from "../commands/syncIMDB";
import { REQUEST_IMDB_EXPORTED_FILE_MESSAGE } from "../utils/constants";
import { writeFileToGithub } from "../utils/writeFileToGithub";

export const documentEvent = async (ctx) => {
  if (
    (ctx.update.message?.reply_to_message as any)?.text ===
    REQUEST_IMDB_EXPORTED_FILE_MESSAGE
  ) {
    try {
      const dataWithRate = await getDataWithRate(ctx);
      ctx.reply("Please wait while I'm syncing your watchlist...");
      await writeFileToGithub(
        JSON.stringify(dataWithRate),
        "src/data/imdb.json"
      );
      ctx.reply("done! 🎉");
    } catch (error) {
      ctx.reply("Error: " + error.message);
    }
  } else {
    ctx.reply(
      "ايه يا زوز اومال لو مكنتش انت اللي عاملني 😂😂😂 انت باعت فايل من غير ما تقول ده لايه"
    );
  }
};
