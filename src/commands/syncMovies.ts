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
  let largestTitleStringLength = 0;
  moviesWithRate.forEach((movie: any) => {
    if (movie.title.length > largestTitleStringLength) {
      largestTitleStringLength = movie.title.length;
    }
  });

  const moviesWithRateString =
    `<h1>My ratings on Movies</h1><br /><br />   \
  Here's a list of my ratings on all the movies I watched in my entire life.<br /><br />   \
  The list is updated from time to time.<br /><br />   \
  The list is sorted by the best rating I gave to the movie to the worst.<br /><br />   \
  Total Movies: <b>${moviesWithRate.length}</b><br /><br />   \
  ` +
    moviesWithRate
      .sort((a: any, b: any) => Number(b.rate) - Number(a.rate))
      .map(
        (movie: any) =>
          `<a href='${movie.url}'>${movie.title}</a> ` +
          ` ${
            Array.from({
              length: largestTitleStringLength - movie.title.length + 6,
            })
              .map(() => "-")
              .join("") + ">"
          } ${movie.rate}<br />`
      )
      .join("");

  const content = Buffer.from(
    JSON.stringify(moviesWithRateString).replace(/"/g, "").replace(/'/g, '"')
  ).toString("base64");

  return new Promise(async (resolve, reject) => {
    try {
      let shaValue = null;
      try {
        const { data: { sha } = { sha: null } } = await octokit.request(
          "GET /repos/{owner}/{repo}/contents/{file_path}",
          {
            owner: "zeyadetman",
            repo: "Notes",
            file_path: "docs/Movies/Watched List.md",
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
          path: "docs/Movies/Watched List.md",
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
