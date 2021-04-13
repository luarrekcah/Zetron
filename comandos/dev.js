module.exports.run = async (client, message, args) => {
  if (!message.from.includes("556899499019")) return;
  const escolha = args.join(" ");
  if (!escolha)
    return client.sendText(
      message.from,
      `Olá desenvolvedor.

Comandos:

  *off*
  *on*
  *restart*
  `
    );
  if (escolha == "off") {
    await client
      .setProfileStatus(`BOT OFF | Avisos no Twitter: @_luarrekcah`)
      .then(client.sendText(message.from, "Recado atualizado..."));
    await client
      .setProfilePic("./assets/bot_off.png")
      .then(client.sendText(message.from, "Foto de perfil atualizada..."));
  }
  if (escolha == "on") {
    await client
      .setProfileStatus(`BOT ON | Avisos no Twitter: @_luarrekcah`)
      .then(client.sendText(message.from, "Recado atualizado..."));
    await client
      .setProfilePic("./assets/bot_on.png")
      .then(client.sendText(message.from, "Foto de perfil atualizada..."));
  }
  if (escolha == "restart") {
    client.sendText(message.from, "Reiniciando sistema em 5 segundos...");
    setTimeout(async () => {
      await client.restartService();
    }, 5000);
  }
  if(escolha == "unblock") {
    const membro = args[1];
    const num = membro.replace("@", "");
    client.unblockContact(`${membro}@c.us`).then(client.sendText(message.from, "Usuário desbloqueado"));
  }
};
