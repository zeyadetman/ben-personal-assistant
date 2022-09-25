export const start = async (ctx) => {
  if (ctx.message.from.username === "zeyadetman") {
    ctx.reply(
      "Welcome Zeyad, I'm your personal assistant, how can I help you?"
    );
  } else {
    ctx.reply("You're not allowed to use this command");
    ctx.reply("أنت مين يا عم؟");
  }
};
