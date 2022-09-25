import axios from "axios";
import * as csv from "csvtojson";
import * as showdown from "showdown";
import * as jsdom from "jsdom";

import { octokit } from "..";
import { Markup } from "telegraf";
import { REQUEST_IMDB_EXPORTED_FILE_MESSAGE } from "../utils/constants";

export const syncIMDB = (ctx) => {
  if (ctx.message.from.username === "zeyadetman") {
    ctx.reply(REQUEST_IMDB_EXPORTED_FILE_MESSAGE, Markup.forceReply());
  } else {
    ctx.reply("You're not allowed to use this command");
    ctx.reply("أنت مين يا عم؟");
  }
};

export const getDataWithRate = (ctx: any) => {
  return new Promise(async (resolve, reject) => {
    const documentId = ctx.update.message.document.file_id;
    const {
      result: { file_path: filePath },
    } = await (
      await axios.get(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${documentId}`
      )
    ).data;
    const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${filePath}`;
    const fileContent = await (await axios.get(fileUrl)).data;
    const content = await csv().fromString(fileContent);
    const dataWithRate = content
      .map((item) => ({
        title: item.Title,
        url: item.URL,
        type: item["Title Type"],
        genres: item.Genres.split(", "),
        rate: item["Your Rating"],
      }))
      .filter((item) => item.rate);

    const data = {
      movies: dataWithRate.filter((item) => item.type === "movie"),
      videoGames: dataWithRate.filter((item) => item.type === "videoGame"),
      tvSeries: dataWithRate.filter(
        (item) => item.type === "tvSeries" || item.type === "tvEpisode"
      ),
    };

    resolve(data);
  });
};
