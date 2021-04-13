module.exports.run = async (client, message, args, config) => {
  const sayM = args.join(" ");
  if (!sayM)
    return client.sendText(
      message.from,
      "⚠️ | Você não digitou algo para que eu repita."
    );
  client.sendText(message.from, sayM);
};
