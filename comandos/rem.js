module.exports.run = async (client, message, args) => {
  return;
  /*
  if(!message.isGroupMsg) return;
  var adms = [];
  var i,x = "";
  const admList = await client.getGroupAdmins(message.from); 
  for (i = 0;i < admList.length; i++) {
    x += adms.push(admList[i].user);
  }
  //console.log(x);
  //console.log("\n\nadms do gp: " + adms);
  
  const membro = message.mentionedJidList;
  const autor = message.author.replace("@c.us", "");
  const eu = message.to.replace("@c.us","");
  if(!adms.includes(eu)) return client.sendText(message.from, "Eu não consigo remover membros pois eu não sou Administrador.");
  if (adms.includes(autor)) {
    if(!args[0]) return client.sendText(message.from, "Mencione um membro para remover.");
    await client.removeParticipant(message.from, membro);
  } else {
    client.sendText(
      message.from,
      "Apenas administradores do grupo podem retirar membros."
    );
  }
  console.log(admList);
  */
};
