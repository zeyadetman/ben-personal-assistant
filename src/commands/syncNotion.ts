import { convertTitleToFileName } from "../utils/convert-name";
import { writeFileToGithub } from "../utils/writeFileToGithub";

export const syncNotion = async (ctx: any) => {
  if (ctx.message.from.username !== "zeyadetman") {
    ctx.reply("You're not allowed to use this command");
    ctx.reply("أنت مين يا عم؟");
    return;
  }

  const { Client } = require("@notionhq/client");
  const { NotionToMarkdown } = require("notion-to-md");

  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const { results: pages } = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: "Type",
      select: {
        equals: "Book",
      },
    },
  });

  const n2m = new NotionToMarkdown({ notionClient: notion });

  const result = await Promise.allSettled(
    pages.map(async (page) => {
      const mdblocks = await n2m.pageToMarkdown(page.id);
      return { mdblocks, title: page.properties.Name.title[0].plain_text };
    })
  );

  result.forEach(async (item) => {
    if (item.status === "fulfilled") {
      const { mdblocks, title } = item.value;
      const mdString = n2m.toMarkdownString(mdblocks);
      await writeFileToGithub(
        JSON.stringify(mdString).replace(/\\n/g, " \r\n ").replace(/\"/g, ""),
        `docs/books/${convertTitleToFileName(title)}.md`
      );
    }
  });
};
