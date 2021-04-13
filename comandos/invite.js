module.exports.run = async (client, message, args) => {
    const crypto = require("crypto");
  const id = crypto.randomBytes(16).toString("hex");
    if(!message.isGroupMsg) return;
    var adms = [];
    var i,x = "";
    const admList = await client.getGroupAdmins(message.from); 
    for (i = 0;i < admList.length; i++) {
      x += adms.push(admList[i].user);
    }
    if(!adms.includes(eu)) return client.sendText(message.from, "Eu não consigo pegar o link pois eu não sou Administrador. \n\nId da mensage: " + id);
    try{
    const i = await client.getGroupInviteLink(message.from);
    setTimeout(() => {
        client.sendText(message.from, `Aqui está o link: ${i}

Id da mensagem: ${id}`);
    }, 1000);
} catch (e) {
    console.log(e);
}
  };
  