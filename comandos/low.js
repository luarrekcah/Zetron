module.exports.run = async (client, message, args) => {
  //return;
    if(!message.isGroupMsg) return;
    const id = crypto.randomBytes(16).toString("hex");
    var adms = [];
    var i,x = "";
    const admList = await client.getGroupAdmins(message.from); 
    for (i = 0;i < admList.length; i++) {
      x += adms.push(admList[i].user);
    }
    console.log(x);
    console.log("\n\nadms do gp: " + adms);
    
    const membro = message.mentionedJidList;
    //const mC = membro.replace("@c.us", "");
    const autor = message.author.replace("@c.us", "");
    const eu = message.to.replace("@c.us","");
    let aviso = membro.length >= 2 ? membro.length + " membros rebaixados. id:"+id : "Membro rebaixados. Id:"+id;
    if(!adms.includes(eu)) return client.sendText(message.from, "Eu não consigo rebaixar membros pois eu não sou Administrador. id:" + id);
    if(adms.includes(membro)) return client.sendText(message.from, "Esse usuário já é um administrador. id:"+id);
    if (adms.includes(autor)) {
      if(!args[0]) return client.sendText(message.from, "Mencione um membro para rebaixar. id:"+id);
      await client.demoteParticipant(message.from, membro).then(client.sendText(message.from, aviso));
    } else {
      client.sendText(
        message.from,
        "Apenas administradores do grupo podem rebaixar membros. id:"+id
      );
    }
    console.log(admList);
  };
  