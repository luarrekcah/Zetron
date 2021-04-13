module.exports.run = async (client, message, args) => {
  const cllr = await client.getHostDevice();
  const td = {
    false: "Não",
    true: "Sim",
  };
  client.startTyping(message.from);
  setTimeout(() => {
    client.stopTyping(message.from);
    client.sendText(
        message.from,
        `*${cllr.pushname}*
    
    📞 | Número: *${cllr.wid.user}*
    🔋 | Bateria: *${cllr.battery}%* => 🔌 | Carregando: *${td[cllr.plugged]}*
    
    ==Infos do host==
     ℹ️ | Versão do WA => *${cllr.phone.wa_version}*
    🤖| Android => *${cllr.phone.os_version}*
    🌐 | Marca => *${cllr.phone.device_manufacturer}*
    📱 | Modelo => *${cllr.phone.device_model}*
            `
      );
  }, 2000);
};
