import axios from "axios";
import * as csv from "csvtojson";
import { octokit } from "..";

export const getMoviesWithRate = (ctx: any) => {
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
    const moviesWithRate = content
      .map((movie) => ({
        title: movie.Title,
        url: movie.URL,
        rate: movie["Your Rating"],
      }))
      .filter((movie) => movie.rate);

    resolve(moviesWithRate);
  });
};

export const writeFileToGithub = (moviesWithRate: any) => {
  const content = Buffer.from(
    JSON.stringify(
      moviesWithRate
        .map(
          (movie: any) =>
            `<div style='display:flex;justify-content:space-between;align-items: center; width: 100%;'>[${movie.title}](${movie.url}) --> ${movie.rate}</div><br />`
        )
        .join("")
    ).replace(/"/g, "")
  ).toString("base64");

  return new Promise(async (resolve, reject) => {
    try {
      const {
        data: { sha },
      } = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{file_path}",
        {
          owner: "zeyadetman",
          repo: "Notes",
          file_path: "movies/watchedList.md",
        }
      );

      const res = await octokit.request(
        "PUT /repos/{owner}/{repo}/contents/{path}",
        {
          owner: "zeyadetman",
          repo: "Notes",
          ...(sha && { sha }),
          path: "movies/watchedList.md",
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
