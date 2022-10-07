import { convertTitleToFileName } from "../utils/convert-name";
import { writeFileToGithub } from "../utils/writeFileToGithub";

export const syncNotion = async (ctx: any) => {
  const util = require("util");
  if (ctx.message.from.username !== "zeyadetman") {
    ctx.reply("You're not allowed to use this command");
    ctx.reply("أنت مين يا عم؟");
    return;
  }

  const { Client } = require("@notionhq/client");
  const { NotionToMarkdown } = require("notion-to-md");

  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const n2m = new NotionToMarkdown({ notionClient: notion });

  const handleDatabases = async (
    databaseId: string,
    pagesToPublish: any,
    parentSlug = ""
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { results } = await notion.databases.query({
          database_id: databaseId,
        });
        const pages = results.filter((res) => res.object === "page");
        pages.forEach(async (page: any) => {
          if (page?.properties?.Slug?.rich_text?.[0]?.plain_text) {
            pagesToPublish[page.properties.Slug.rich_text[0].plain_text] = {
              slug: page.properties.Slug.rich_text[0].plain_text,
              isPublish: page.properties?.Published?.checkbox || false,
              path: `${parentSlug || ""}${
                page.properties.Slug.rich_text[0].plain_text
              }`,
              page,
            };
          } else {
            return ctx.reply("Please add a slug to the page");
          }
        });

        for await (let page of Object.values(pagesToPublish)) {
          const { slug, page: pageInfo } = page as any;
          const mdblocks = await n2m.pageToMarkdown(pageInfo.id);
          const finalMdBlocks = [];
          mdblocks?.forEach(async (block: any, index) => {
            if (index === mdblocks?.length - 1) {
              return;
            }
            if (block.type === "child_database") {
              const databaseId = block.parent.split("(").pop().split(")")[0];
              pagesToPublish[slug].children = {
                databaseId,
                slug,
                parentSlug: `${parentSlug || ""}${slug}`,
              };
            } else {
              finalMdBlocks.push(block);
            }
          });

          pagesToPublish[slug].mdBlocks = finalMdBlocks;
        }

        for await (let page of Object.keys(pagesToPublish)) {
          const { children, slug } = pagesToPublish[page] as any;
          if (children?.databaseId) {
            pagesToPublish[slug].childs = await handleDatabases(
              children.databaseId,
              {},
              `${children.parentSlug}`
            );
          }
        }

        console.log(util.inspect(pagesToPublish, false, null, true));
        return resolve(pagesToPublish);
      } catch (error) {
        return reject(error.message);
      }
    });
  };

  try {
    ctx.reply("Fetching database...");
    const pagesToPublish = await handleDatabases(
      process.env.NOTION_DATABASE_ID,
      {}
    );
    ctx.reply("Fetching database is done! 🎉");

    const writeToGitHub = async (pages: any) => {
      for await (let slug of Object.keys(pages)) {
        const mdString = n2m.toMarkdownString(pages[slug].mdBlocks);

        if (pages[slug].isPublish) {
          const filePath = pages[slug].childs
            ? `${pages[slug].path}/index`
            : pages[slug].path;

          ctx.reply(`writing file to github: docs${filePath}.md`);
          await writeFileToGithub(
            JSON.stringify(mdString).replace(/\\n/g, "\r\n").replace(/\"/g, ""),
            `docs${filePath}.md`
          );
        }

        if (
          pages[slug]?.childs &&
          Object.keys(pages[slug]?.childs)?.length > 0
        ) {
          await writeToGitHub(pages[slug].childs);
        }
      }
    };

    try {
      ctx.reply("Writing to GitHub...");
      console.log("Writing to GitHub...");
      await writeToGitHub(pagesToPublish);
      ctx.reply("Writing to GitHub is done! 🎉");
    } catch (error) {
      ctx.reply(error.message);
    }
  } catch (error) {
    ctx.reply("Error while fetching data from Notion");
    ctx.reply(JSON.stringify(error.message));
  }
};
