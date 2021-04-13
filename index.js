const venom = require("venom-bot");
const fs = require("fs");
const glob = require("glob");
const Axios = require("axios");
const ProgressBar = require("progress");
const Zip = require("node-7z");
const mime = require("mime-types");
const crypto = require("crypto");
const Jimp = require("jimp");
const sharp = require("sharp");
const ffmpeg = require("fluent-ffmpeg");
//const { compress } = require("compress-images/promise.js");
const { compress } = require("compress-images/promise");
//const { compress } = require("pngquant-bin");

const config = require("./config.json");
const prefixo = config.prefixo;
require("events").EventEmitter.defaultMaxListeners = 1000;

process.on("unhandledRejection", (reason, promise) => {
  // console.log(reason);
  // console.log(promise);
});

run();

let talkedRecently = new Set();
let cmd_talkedRecently = new Set();
//let block_chat = new Set();
let block_chat = [];
let saud = new Set();
async function run() {
  if (!fs.existsSync("./temp")) {
    fs.mkdirSync("./temp");
  }

  if (!fs.existsSync("./tools/ffmpeg/ffmpeg.exe")) {
    console.log("ffmpeg.exe não detectado...");
    await downloadFfmpeg();
    console.log("Download completo");
    console.log("Iniciando extração de ffmpeg.exe");
    const extract = await new Promise((resolve, reject) => {
      let file;
      const extract = Zip.extractFull("./temp/ffmpeg.7z", "./temp/", {
        $progress: true,
        $bin: "./tools/7zip/7za.exe",
        recursive: true,
        $cherryPick: "ffmpeg.exe",
      });
      extract.on("data", (data) => (file = data));
      extract.on("end", () => {
        if (!fs.existsSync("./tools/ffmpeg")) {
          fs.mkdirSync("./tools/ffmpeg");
        }
        fs.rename(
          `temp/${file.file}`,
          "tools/ffmpeg/ffmpeg.exe",
          async (err) => {
            if (err) {
              reject(err);
            }
            resolve("Extração completa.");
          }
        );
      });
      extract.on("error", reject);
    });
    console.log(extract);
    await fs.rmdirSync("./temp/", {
      recursive: true,
    });
    await fs.mkdirSync("./temp");
  }

  venom
    .create()
    .then((client) => start(client))
    .catch((erro) => {
      console.log(erro);
    });
}
async function downloadFfmpeg() {
  const url = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.7z";
  const writer = fs.createWriteStream("./temp/ffmpeg.7z");

  const response = await Axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  const totalLength = response.headers["content-length"];

  console.log("Starting ffmpeg.zip download");
  const progressBar = new ProgressBar(
    "-> Downloading ffmpeg.exe [:bar] :percent :etas",
    {
      width: 40,
      complete: "=",
      incomplete: " ",
      renderThrottle: 16,
      total: parseInt(totalLength),
    }
  );

  response.data.on("data", (chunk) => {
    progressBar.tick(chunk.length);
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}
/*


INICIO =>


*/
async function start(client) {
  client.onAddedToGroup((chatEvent) => {
    console.log("Fui adicionado em um novo grupo: " + chatEvent);
  });
  client.onIncomingCall(async (call) => {
    console.log(call);
    return;
  });
  client.onMessage(async (message) => {
    if (!message.sender.isMyContact && !message.isGroupMsg) return;

    if (message.content == undefined) {
      console.log("Indefinido.");
    }
    await client.sendSeen(message.from);
    let autorNick =
      message.sender.pushname == undefined ? "" : message.sender.pushname;
    let eu = message.to.replace("@.us", "");
    await genSticker(client, message);
    if (
      message.isGroupMsg &&
      !config.wlGps.includes(message.from) &&
      config.permitir_grupo === false
    ) {
      client.sendText(
        message.from,
        "Esse grupo não está na whitelist e minhas configurações não me permitem ficar.\nPara adicionar a whitelist fale com wa.me/" +
          config.numero_dev
      );
      setTimeout(() => {
        client.leaveGroup(message.from);
      }, 1000);
    }
    if (message.content == prefixo + "unlock" && message.isGroupMsg) {
      var adms = [];
      var i,
        x = "";
      const admList = await client.getGroupAdmins(message.from);
      for (i = 0; i < admList.length; i++) {
        x += adms.push(admList[i].user);
      }
      const autor = message.author.replace("@c.us", "");
      if (adms.includes(autor)) {
        block_chat = [];
        const id = crypto.randomBytes(16).toString("hex");
        client.sendText(
          message.from,
          "Bot pode ser usado aqui agora.\n\nID da mensagem: " + id
        );
      } else {
        const id = crypto.randomBytes(16).toString("hex");
        return client.sendText(
          message.from,
          "Apenas administradores do grupo podem desbloquear o bot.\n\nID da mensagem: " +
            id
        );
      }
    }
    if (message.content == prefixo + "lock" && message.isGroupMsg) {
      var admsa = [];
      var ia,
        xa = "";
      const admList = await client.getGroupAdmins(message.from);
      for (ia = 0; ia < admList.length; ia++) {
        xa += admsa.push(admList[ia].user);
      }
      const autor = message.author.replace("@c.us", "");
      if (admsa.includes(autor)) {
        const id = crypto.randomBytes(16).toString("hex");
        block_chat.push(message.from);
        client.sendText(
          message.from,
          "Bot não poderá ser usado aqui agora.\n\nID da mensagem: " + id
        );
      } else {
        const id = crypto.randomBytes(16).toString("hex");
        return client.sendText(
          message.from,
          "Apenas administradores do grupo podem bloquear o bot.\n\n" + id
        );
      }
    }
    if (block_chat.includes(message.from)) return;
    const idA = crypto.randomBytes(16).toString("hex");
    if (
      message.type == "video" &&
      message.duration > 15 &&
      message.caption == prefixo + "sticker"
    )
      return client.sendText(
        message.from,
        "Seu arquivo excede os 15 segundos, recorte-o.\n\nID da mensagem: " +
          idA
      );
    if (message.type == "sticker" && message.isGroupMsg === false) return;
    if (
      (message.isGroupMsg === false && message.type == "audio") ||
      message.mimetype == "audio/ogg; codecs=opus" ||
      message.type == "ppt"
    )
      return; // client.sendText(message.from, "Não me envie audios...");
    if (message.type === "sticker" && message.isGroupMsg) return;
    const idM = crypto.randomBytes(16).toString("hex");
    if (message.mentionedJidList.includes(eu)) {
      if (saud.has(message.sender.id)) return;
      saud.add(message.sender.id);
      setTimeout(() => {
        saud.delete(message.from);
      }, 60 * 1000);
      return client.sendText(
        message.from,
        `🤖Olá ${autorNick}!

Eu sou um bot de figurinhas para o whatsapp! 😝

*#help* para obter ajuda.
*#comandos* para ver meus comandos.

Me siga no Twitter para receber avisos e saber das novidades!
=> *@_luarrekcah*

Grupo para suporte: ${config.grupo}
  
ID da mensagem: ${idM}
    `
      );
    }

    if (message.type == "audio") return;
    if (
      !message.content.startsWith(prefixo) &&
      message.content.length < 50 &&
      message.isGroupMsg === false
    ) {
      if (saud.has(message.sender.id)) return;
      saud.add(message.sender.id);
      setTimeout(() => {
        saud.delete(message.from);
      }, 60 * 1000);
      const idW = crypto.randomBytes(16).toString("hex");
      return client.sendText(
        message.from,
        `🤖Olá ${autorNick}!
  
  Eu sou um bot de figurinhas para o whatsapp! 😝
  
  *#help* para obter ajuda.
  *#comandos* para ver meus comandos.
  
  Me siga no Twitter para receber avisos e saber das novidades!
  => *@_luarrekcah*

  Grupo para suporte: ${config.grupo}

  ID da mensagem: ${idW}
        `
      );
      //COMANDOS INI
    }
    if (message.content == undefined) {
      //console.log("Indefinido.");
    } else {
      try {
        if (message.content.startsWith(prefixo)) {
          console.log(message);
          /* if(cmd_talkedRecently.has(message.sender.id)) return client.sendText(message.from, "⚠️ | Espere 2 segundos para usar outro comando.");
          cmd_talkedRecently.add(message.sender.id);
          setTimeout(() => {
            cmd_talkedRecently.delete(message.from);
          }, 2000);
          */
          let args = message.content.split(" ").slice(1);
          let command = message.content.split(" ")[0];
          command = command.slice(prefixo.length);
          let commandFile = require(`./comandos/${command}.js`);

          return commandFile.run(client, message, args, config);
        }
      } catch (err) {
        console.log("o erro é :" + err);
        // client.sendText(message.from, "Erro: " + err);
        if (err.code == "MODULE_NOT_FOUND")
          return client.sendText(
            message.from,
            `${message.content} não é um comando`
          );
      }
    }
  });
}

//COMANDOS FIM

async function genSticker(client, message) {
  const id = crypto.randomBytes(16).toString("hex");
  if (message.type === "image") {
    if (message.isGroupMsg === true && message.caption !== prefixo + "sticker")
      return;
    if (talkedRecently.has(message.from))
      return client.sendText(
        message.from,
        "*⚠️ | Espere 5 segundos para enviar outra mídia...*"
      );
    talkedRecently.add(message.from);
    setTimeout(() => {
      talkedRecently.delete(message.from);
    }, 5000);
    client.sendText(
      message.from,
      `*✅ | Imagem coletada, aguarde...* ID da mensagem: ${id}`
    );
    client.startTyping(message.from);
    const img = message.quotedMsgObj || message;
    const decryptFile = await client.decryptFile(img);
    const file = `./temp/${id}.png`;
    try {
      await sharp(decryptFile)
        .resize({
          width: 800,
          height: 800,
          fit: "contain",
          background: {
            r: 255,
            g: 255,
            b: 255,
            alpha: 0,
          },
        })
        .toFormat("png")
        .toFile(file)
        .then((info) => {
          client.sendText(
            message.from,
            `*🔁 | Enviando sticker...* ID da mensagem: ${id}`
          );
          client.stopTyping(message.from);
          console.log(info);
        })
        .catch((err) => {
          console.log(err);
          client.stopTyping(message.from);
          client.sendText(
            message.from,
            "Ocorreu um erro, tente novamente. \nErro:" + err.status
          );
        });

      await client
        .sendImageAsSticker(message.from, file)
        .then((result) => {
          console.log("Resultado: ", result);
        })
        .catch((erro) => {
          console.error("Erro quando estou enviando: ", erro.status);
          client.sendText(
            message.from,
            "Ocorreu um erro, tente novamente. \nErro:" + erro.status
          );
        });
    } catch (erro) {
      client.sendText(message.from, "Ocorreu um erro, tente outra mídia.");
      console.log("Erro ao fazer sticker de imagem: " + erro.status);
    }
    await fs.unlinkSync(file);
  } else if (message.type === "video" && message.duration < 15) {
    if (message.caption !== prefixo + "sticker" && message.isGroupMsg) return;
  // return client.sendText(message.from, `No momento o bot está com um erro no módulo de compressão, e não pode fazer stickers animados. Id da mensagem: ${id}`);
    try {
      if (talkedRecently.has(message.from))
        return client.sendText(message.from, "*⚠️ | Espere 5 segundos...*");
      talkedRecently.add(message.from);
      setTimeout(() => {
        talkedRecently.delete(message.from);
      }, 5000);
      client.sendText(
        message.from,
        `*✅ | Vídeo/Gif coletado, aguarde...* ID da mensagem: ${id}`
      );
      client.startTyping(message.from);
      const decryptFile = await client.decryptFile(message);
      const file = `${id}.${mime.extension(message.mimetype)}`;

      await fs.writeFile(`./temp/${file}`, decryptFile, (err) => {
        if (err) {
          console.log(err);
        }
      });

      await new Promise((resolve, reject) => {
        ffmpeg(`./temp/${file}`)
          .setFfmpegPath("./tools/ffmpeg/ffmpeg.exe")
          .complexFilter(
            `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`
          )
          .save(`./temp/${id}.gif`)
          .on("error", (err) => {
            console.log(`[ffmpeg] erro: ${err.message}`);
            client.sendText(
              message.from,
              "Houve um erro ao tentar fazer seu sticker: " + err.message
            );
            reject(err);
          })
          .on("end", () => {
            console.log("[ffmpeg] Terminado");
            resolve();
          });
      });

      await new Promise((resolve, reject) => {
        ffmpeg(`./temp/${id}.gif`)
          .save(`./temp/ext${id}%d.png`)
          .on("error", (err) => {
            console.log(`[ffmpeg] erro: ${err.message}`);
            client.sendText(
              message.from,
              "Houve um erro ao tentar fazer seu sticker: " + err.message
            );
            reject(err);
          })
          .on("end", () => {
            console.log("[ffmpeg] Terminado");
            resolve();
          });
      });

      console.log("Color treated");
      const frame1 = await Jimp.read(`./temp/ext${id}1.png`);
      for (let i = 1; i < 320; i++) {
        for (let j = 1; j < 320; j++) {
          let colors = await Jimp.intToRGBA(frame1.getPixelColor(i, j));
          if (colors.r > 155) {
            colors.r = colors.r - 5;
          } else {
            colors.r = colors.r + 5;
          }
          if (colors.g > 155) {
            colors.g = colors.g - 5;
          } else {
            colors.g = colors.g + 5;
          }
          if (colors.b > 155) {
            colors.b = colors.b - 5;
          } else {
            colors.b = colors.b + 5;
          }
          if (colors.a > 155) {
            colors.a = colors.a - 5;
          } else {
            colors.a = colors.a + 5;
          }

          let hex = await Jimp.rgbaToInt(
            colors.r,
            colors.g,
            colors.b,
            colors.a
          );

          await frame1.setPixelColor(hex, i, j);
        }
      }
      await frame1.write(`./temp/ext${id}1.png`);

      await new Promise((resolve, reject) => {
        ffmpeg(`./temp/ext${id}%d.png`)
          .complexFilter(
            `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`
          )
          .fpsOutput(15)
          .save(`./temp/${id}mod.gif`)
          .on("error", (err) => {
            console.log(`[ffmpeg] erro: ${err.message}`);
            reject(err);
          })
          .on("end", () => {
            console.log("[ffmpeg] Terminado");
            resolve();
          });
      });
/*
      const compressGif = async (onProgress) => {
        const result = await compress({
          source: `./temp/${id}mod.gif`,
          destination: `./temp/opt`,
          onProgress,
          enginesSetup: {
            jpg: {
              engine: "mozjpeg",
              command: ["-quality", "60"],
            },
            png: {
              engine: "pngquant",
              command: ["--quality=20-50", "-o"],
            },
            svg: {
              engine: "svgo",
              command: "--multipass",
            },
            gif: {
              engine: "gifsicle",
              command: ["--optimize", "--lossy=80"],
            },
          },
        });

        const { statistics, errors } = result;
      };
*/
      /*await compressGif(async (error, statistic, completed) => {
        if (error) {
          client.sendText(
            message.from,
            "Houve um erro ao tentar processar o arquivo: " + error
          );
          console.log(
            "Um erro ocorreu enquanto eu estava processando o arquivo: "
          );
          console.log(error);
          return;
        }
        console.log("Arquivo processado com sucesso.");
        const idO = crypto.randomBytes(16).toString("hex");
        client.sendText(
          message.from,
          `*🔁 | Enviando sticker...* ID da mensagem: ${idO}`
        );
        client.stopTyping(message.from);
        console.log(statistic);
        await client
        .sendImage(message.from, `./temp/${id}mod.gif` /*statistic.path_out_new);
        await client
          .sendImageAsStickerGif(message.from, `./temp/${id}mod.gif`/*statistic.path_out_new)
          .then((result) => {
            console.log("Resultado: ", result);
          })
          .catch((erro) => {
            client.stopTyping(message.from);
            client.sendText(
              message.from,
              "Ocorreu um erro, tente novamente. \nErro:" + erro.status
            );
            console.error("Erro quando estou enviando: ", erro.status);
          });
      });*/
      await client
      .sendImageAsStickerGif(message.from, `./temp/${id}mod.gif`/*statistic.path_out_new*/)
      .then((result) => {
        console.log("Resultado: ", result);
      });
      await glob.Glob(`./temp/*${id}*`, async function (er, files) {
        files.forEach((file) => {
          fs.unlinkSync(file);
        });
      });
    } catch (erro) {
      client.sendText(
        message.from,
        "Ocorreu um erro, tente outra mídia. " + erro
      );
      console.log("Erro ao fazer sticker animado: " + erro);
    }
  } else if (message.type === "video" && message.duration > 15) {
    if (message.caption !== prefixo + "sticker" && message.isGroupMsg) return;
    client.sendText(message.from, `Vídeo/gif muito grande para fazer sticker, corte-o para menos de 15 segundos. Id da mensagem: ${id}`);
  }
}
