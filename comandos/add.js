module.exports.run = async (client, message, args) => {
    if(!message.isGroupMsg) return;
    const num = args.join(" ");
    if(!num) return client.sendText(message.from, "Digite o número para adicionar. \nExemplo: #add 556899499019");
    try {
        await client.addParticipant(message.from, `${num}@c.us`).catch(console.log);
    } catch (e) {
        console.log(e);
    }
};