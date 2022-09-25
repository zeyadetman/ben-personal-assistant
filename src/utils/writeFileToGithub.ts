import { octokit } from "..";

export const writeFileToGithub = (data: any, filePath: string) => {
  const content = Buffer.from(data).toString("base64");

  return new Promise(async (resolve, reject) => {
    try {
      let shaValue = null;
      try {
        const { data: { sha } = { sha: null } } = await octokit.request(
          "GET /repos/{owner}/{repo}/contents/{file_path}",
          {
            owner: "zeyadetman",
            repo: "Notes",
            file_path: filePath,
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
          path: filePath,
          message: `Update ${filePath}`,
          committer: {
            name: "zeyadetman",
            email: "zeyadetman@gmail.com",
          },
          content,
        }
      );
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};
