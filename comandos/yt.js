const snekfetch = require("snekfetch");
module.exports.run = async (client, message, args, config) => {
  const query = args.join(" ");
  if (!query)
    return client.sendText(
      message.from,
      "⚠️ | Escolha o que eu deveria pesquisar no YouTube."
    );
  client.startTyping();
  const { body } = await snekfetch
    .get("https://www.googleapis.com/youtube/v3/search")
    .query({
      part: "snippet",
      type: "video",
      maxResults: 1,
      q: query,
      key: config.keys.googleKey,
    });
  if (!body.items.length)
    return client
      .sendText(message.from, "Sem resultados para " + query + ".")
      .then(client.stopTyping());
  client.sendText(
    message.from,
    `🌐 | YouTube

*${body.items[0].snippet.title}*

link: https://www.youtube.com/watch?v=${body.items[0].id.videoId}

Canal ${body.items[0].snippet.channelTitle}
        `
  );
};
