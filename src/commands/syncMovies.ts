import axios from "axios";
import * as csv from "csvtojson";
import * as showdown from "showdown";
import * as jsdom from "jsdom";

import { octokit } from "..";

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

export const writeFileToGithub = (dataWithRate: any) => {
  const content = Buffer.from(JSON.stringify(dataWithRate)).toString("base64");

  return new Promise(async (resolve, reject) => {
    try {
      let shaValue = null;
      try {
        const { data: { sha } = { sha: null } } = await octokit.request(
          "GET /repos/{owner}/{repo}/contents/{file_path}",
          {
            owner: "zeyadetman",
            repo: "Notes",
            file_path: "src/data/imdb.json",
          }
        );

        shaValue = sha;
      } catch (error) {}

      const res = await octokit.request(
        "PUT /repos/{owner}/{repo}/contents/{path}",
        {
          owner: "zeyadetman",
          repo: "Notes",
          ...(shaValue && { sha: shaValue }),
          path: "src/data/imdb.json",
          message: "Update movies rating list",
          committer: {
            name: "zeyadetman",
            email: "zeyadetman@gmail.com",
          },
          content,
        }
      );
      resolve(res);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
