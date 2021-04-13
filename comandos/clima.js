const weather = require("weather-js");

module.exports.run = async (client, message, args) => {
  const cidade = args.join(" ");
  if (!cidade)
    return client.sendText(
      message.from,
      "⚠️ | Digite o nome da cidade para ver o clima."
    );
  client.startTyping();
  weather.find(
    {
      search: cidade,
      degreeType: "C",
    },
    function (err, result) {
      client.stopTyping();
      if (err) console.log(err);
      //console.log(JSON.stringify(result, null, 2));
      if(result == "undefined") return client.sendText(message.from, "Erro.");
      if (!result[0])
        return client.sendText(message.from, `⚠️ | Não encontrei essa cidade.`);
      client.sendText(
        message.from,
        `🌤 | Clima em *${result[0].location.name}*
🌡 | Temperatura: ${result[0].current.temperature}°C
🥵 | Sensação térmica: ${result[0].current.feelslike}°C
💧 | Umidade: ${result[0].current.humidity}%
🌬 | Vento: ${result[0].current.windspeed}
            `
      );
    }
  );
};
