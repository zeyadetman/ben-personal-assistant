export const help = async (ctx: any) => {
  ctx.reply(`
    Here's a list of commands you can use:\n
    - /start: Start the bot
    - /help: Show this message
    - /syncIMDB: Sync your IMDB watchlist to github
    - /syncNotion: Sync your Notion database to github
  `);
};
