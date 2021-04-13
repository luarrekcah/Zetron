const gis = require("g-i-s");

module.exports.run = async (client, message, args, config) => {
  console.log("Iniciado");
  const wordList = [
    "shitting",
    "rape",
    "gore",
    "hétero",
    "pissing",
    "mijando",
    "cagando",
    "coco",
  ];
  if (args.toLowerCase().includes(wordList)) return;
  console.log("Palavras limpas");
  function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
  }
  if (config.modo_eco === true)
    return client.sendText(
      message.from,
      "Modo economia do bot está ativo, esse comando está temporatiamente desativado."
    );
  const escolha = args.join(" ");
  if (!escolha)
    return client.sendText(
      message.from,
      "⚠️ | Digite algo para que eu traga uma imagem para você."
    );
  client.startTyping(message.from);
  client.sendText(message.from, "🔍 | Procurando por " + escolha);
  gis(escolha, logResults);
  async function logResults(error, results) {
    const maxN = results.length;
    const url1i = randomInt(1, maxN);
    if (error) {
      console.log(erro);
      client.sendText(message.from, "Ocorreu um erro, tente novamente...");
      client.stopTyping(message.from);
    }
    const url1 = results[url1i].url;
    try {
      client.sendImage(
        message.from,
        url1,
        escolha,
        `Image search - Resultado para *${escolha}*`
      );
      client.stopTyping(message.from);
    } catch (e) {
      console.log(e);
    }
  }
};
