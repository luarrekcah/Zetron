const solenolyrics = require("solenolyrics");

module.exports.run = async (client, message, args) => {
  //return client.sendText(message.from, "Comando desativado por questões de crashes, em desenvolvimento...");
  const escolha = args.join(" ");
  if (!escolha || escolha.length > 50)
    return client.sendText(
      message.from,
      "🔎 | Escolha uma música e eu trarei as letras."
    );
 client.startTyping(message.from);
 try {
  const verify = await solenolyrics.requestLyricsFor(escolha);
 } catch(e) {
   console.log(`erro eh: ${e}`);
 }
 var lyrics = await solenolyrics.requestLyricsFor(escolha);
  console.log(lyrics);
 client.stopTyping(message.from);
    if (lyrics === null || !lyrics || lyrics == undefined || lyrics.length < 10)
      return client.sendText(
        message.from,
        `Oh... Não identifiquei ${escolha}, tente o nome de uma música válida.`
      );
    client.sendText(
      message.from,
      `*Letras de ${escolha}*:

${lyrics}
       
==
*Provido por solenolyrics*
       `
    );

};
