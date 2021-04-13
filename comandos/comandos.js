module.exports.run = async (client, message, args, config) => {
  let talkedRecently = new Set();
  const crypto = require("crypto");
  const id = crypto.randomBytes(16).toString("hex");

  if(talkedRecently.has(message.sender.id)) return;
          
  if (message.isGroupMsg) {
    client.sendText(
      message.from,
      `*Comandos:*

*${config.prefixo}help* - Ajuda sobre o bot.
      
*${config.prefixo}infobot* - Informações técnicas do bot.
          
*${config.prefixo}clima* - Veja o clima de uma cidade
          
*${config.prefixo}gg* - Google Image Search
          
*${config.prefixo}ly* - Pesquise as letras de uma música
          
*${config.prefixo}say* - Faça-me dizer algo
          
*${config.prefixo}wiki* - Procure o significado de uma palavra
          
*${config.prefixo}yt* - Procure vídeos no YouTube

*Comandos para grupo:*

*${config.prefixo}lock* - Assim o bot pode parar de responder no grupo

*${config.prefixo}unlock* - Anula a configuração acima

*${config.prefixo}add* - Adicione uma pessoa pelo bot (ADM)

*${config.prefixo}rem* - Remova usuários (desativado no momento) (ADM)

*${config.prefixo}invite* - Veja o link de convite pelo bot (ADM)

*${config.prefixo}up* - Promova membros para ADM (ADM)
      
*${config.prefixo}low* - Rebaixe ADM para membro (ADM)


Grupo para suporte: ${config.grupo}
      
      
ID da mensagem: ${id}
        
`, message.id.toString()
    );
  } else {
    client.sendText(
      message.from,
      `Comandos:

*${config.prefixo}help* - Ajuda sobre o bot.

*${config.prefixo}infobot* - Informações técnicas do bot.
    
*${config.prefixo}clima* - Veja o clima de uma cidade
    
*${config.prefixo}gg* - Google Image Search
    
*${config.prefixo}ly* - Pesquise as letras de uma música
    
*${config.prefixo}say* - Faça-me dizer algo
    
*${config.prefixo}wiki* - Procure o significado de uma palavra
    
*${config.prefixo}yt* - Procure vídeos no YouTube


Grupo para suporte: ${config.grupo}


ID da mensagem: ${id}
  
    `, message.id.toString()
    );
  }
  talkedRecently.add(message.sender.id);
          setTimeout(() => {
            talkedRecently.delete(message.from);
          }, 10 * 1000);

};
