module.exports.run = async (client, message, args) => {
  const m = await client.getGroupMembers(message.from);
  console.log(m);
};
