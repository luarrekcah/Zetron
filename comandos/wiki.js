const superagent = require("superagent");
const snekfetch = require("snekfetch");
const crypto = require("crypto");
const id = crypto.randomBytes(16).toString("hex");

module.exports.run = async (client, message, args) => {
  const query = args.join(" ");
  if (!query)
    return client.sendText(
      message.from,
      `⚠️ | Escolha o que eu deveria pesquisar no wiki. 

Id da mensagem: ${id}`
    );
  client.startTyping(message.from);
  const { body } = await snekfetch
    .get("https://pt.wikipedia.org/w/api.php")
    .query({
      action: "query",
      prop: "extracts",
      format: "json",
      titles: query,
      exintro: "",
      explaintext: "",
      redirects: "",
      formatversion: 2,
    });
  if (body.query.pages[0].missing) {
    client.stopTyping(message.from);
    client.sendText(message.from, "Sem resultados. Id da mensagem: " + id);
  } else {
    client.stopTyping(message.from);
    client.sendText(
      message.from,
      `🌐 | Wikipedia

🔎 | *${body.query.pages[0].title}*

📚 | ${body.query.pages[0].extract
        .substr(0, 2000)
        .replace(/[\n]/g, "\n\n")}
      `
    );
  }
};
