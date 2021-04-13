module.exports.run = async (client, message, args) => {
  //return;
  console.log("Estou pronto para ser usado.");
    if(!message.isGroupMsg) return;
    const id = crypto.randomBytes(16).toString("hex");
    var adms = [];
    var i,x = "";
    const admList = await client.getGroupAdmins(message.from); 
    for (i = 0;i < admList.length; i++) {
      x += adms.push(admList[i].user);
    }
    //console.log(x);
    //console.log("\n\nadms do gp: " + adms);
    
    const membro = message.mentionedJidList;
    //const mC = message.mentionedJidList.replace("@c.us", "");
    const autor = message.author.replace("@c.us", "");
    const eu = message.to.replace("@c.us","");
    let aviso = membro.length >= 2 ? membro.length + " membros promovidos. id:" + id : "Membro promovido. id:" + id;
    if(!adms.includes(eu)) return client.sendText(message.from, "Eu não consigo promover membros pois eu não sou Administrador. id:"+id);
    if(adms.includes(membro)) return client.sendText(message.from, "Esse usuário já é um administrador. id:"+id);
    if (adms.includes(autor)) {
      if(!args[0]) return client.sendText(message.from, "Mencione um membro para promover. id:" + id
      );
      await client.promoteParticipant(message.from, membro).then(client.sendText(message.from, aviso));
    } else {
      client.sendText(
        message.from,
        "Apenas administradores do grupo podem promover membros. id"+id
      );
    }
    console.log(admList);
  };
  