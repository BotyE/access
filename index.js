const Discord = require("discord.js");
var http = require('http');
var fs = require('fs');
const {AlgebraicCaptcha} = require('algebraic-captcha');
var svg2img = require('svg2img');
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();
bot.on("ready",async () => {
  console.log(`${bot.user.username} онлайн!`);
});

bot.on('guildMemberAdd', member => {
    member.addRole("619257593617055766");
    member.addRole("650988934863519744");
    let embed= new Discord.RichEmbed().setTitle(`PLACE`).setDescription("Добро пожаловать на сервер Place.\nЧтобы стать полноценным участником сервера, вам необходимо пройти верификацию.\n[Верификация](https://discordapp.com/channels/617776960097091783/650795326298521640) в этом канале находится вся информация о прохождении верификации.")
    member.send(embed);
  });
bot.on('raw', react => {
  if(react.t === `MESSAGE_REACTION_ADD` )
  {
      if(react.d.channel_id==='650795326298521640')
  {
    
    let reactionChannel = bot.channels.get(react.d.channel_id);
    if(reactionChannel.messages.has(react.d.message_id))
      return;
    else {
    reactionChannel.fetchMessage(react.d.message_id).then(msg=>{
      let msgReaction = msg.reactions.get(react.d.emoji.name);
      let user = bot.users.get(react.d.user_id);
      return bot.emit('messageReactionAdd',msgReaction,user);
    });
  }

  }
}
});
bot.on('messageReactionAdd', async (messageReaction,user) => {
    const message = messageReaction.message;
    const member = message.guild.members.get(user.id);
    const algebraicCaptcha = new AlgebraicCaptcha({
      width: 300,
      height: 100,
      background: '#ffffff',
      noise: 7,
      minValue: 100,
      maxValue: 1000,
      operandAmount: 1,
      operandTypes: ['+', '-'],
      mode: 'formula',
      targetSymbol: '?'
  });
  let embs = new Discord.RichEmbed().setTitle("Поздравляем вас с успешной проверкой.").setDescription("Теперь вы стали полноценным участником сервера \"Place\"\nСоветуем ознакомиться со всем, что происходит на сервере:");
  let embs1 = new Discord.RichEmbed().setTitle("ИНФОРМАЦИЯ.").setDescription("ᥬ[📰Новости](https://discordapp.com/channels/617776960097091783/650795536567369764)\n│[📖Правила](https://discordapp.com/channels/617776960097091783/650795497455353896)\n│[🔔Опросы](https://discordapp.com/channels/617776960097091783/652888928118112276)\n│[📂Команды](https://discordapp.com/channels/617776960097091783/650795687147208727)\n│[🔑Роли](https://discordapp.com/channels/617776960097091783/650810524208070674)\n│[📺Каналы](https://discordapp.com/channels/617776960097091783/650810608236757019)\n│[🏪Магазин](https://discordapp.com/channels/617776960097091783/650795663516368906)\n│[💰Предприятия](https://discordapp.com/channels/617776960097091783/650795722068721675)\nᥨ[👑Привилегии](https://discordapp.com/channels/617776960097091783/650810920276328488)");
  let embs2 = new Discord.RichEmbed().setTitle("МЕРОПРИЯТИЯ И РАЗВЛЕЧЕНИЯ.").setDescription("\nᥬ[🎲Мероприятия](https://discordapp.com/channels/617776960097091783/652887453526392867)\n│[📕Правила Мероприятий](https://discordapp.com/channels/617776960097091783/652886800658071589)\n│[🃏Роли Мероприятий](https://discordapp.com/channels/617776960097091783/652889181726572564)\n│[🎉Розыгрыши](https://discordapp.com/channels/617776960097091783/652894955953586217)\n│[🎁Халява](https://discordapp.com/channels/617776960097091783/652887105693024296)\n│[🏆Турниры](https://discordapp.com/channels/617776960097091783/652886945579532288)\n│[🎯Конкурсы](https://discordapp.com/channels/617776960097091783/652895015743520768)\n│[🎬Фильмы](https://discordapp.com/channels/617776960097091783/652889044686077972)\n│[💻Обзоры](https://discordapp.com/channels/617776960097091783/652886842500317194)\n│[🎮Игровые Новости](https://discordapp.com/channels/617776960097091783/652886898502795264)\n│[😁Мемы](https://discordapp.com/channels/617776960097091783/652886372788469760)\n│[🎨Творчество](https://discordapp.com/channels/617776960097091783/652888756403044372)\nᥨ[🔍Поиск Игроков](https://discordapp.com/channels/617776960097091783/652889218179268618)");
  let embs3 = new Discord.RichEmbed().setTitle("РАЗВИТИЕ И ОБУЧЕНИЕ").setDescription("│[📃Описание](https://discordapp.com/channels/617776960097091783/652879047985987584)\n│[✨Необычные Факты](https://discordapp.com/channels/617776960097091783/650702726673596416)\n│[📅Расписание Лекций](https://discordapp.com/channels/617776960097091783/652878746604273695)\n│[📡Обсуждение](https://discordapp.com/channels/617776960097091783/652878989076987934)");
  await messageReaction.remove(member).catch(console.error);
  const {image, answer} = await algebraicCaptcha.generateCaptcha();
  svg2img(image, async function(error, buffer) {

    console.log(user.tag + " Начал прохождение проверки.")
fs.writeFileSync(`verify.png`, buffer);
   const attachment = new Discord.Attachment(`${__dirname}/verify.png`, 'verify.png');
    const embed = new Discord.RichEmbed()
        .setTitle('У вас есть одна минута чтобы ввести капчу.')
        .attachFile(attachment)
        .setImage('attachment://verify.png');
        const filter = response => Number(response.content) === Number(answer);
    let mess = await member.send(embed)
      mess.channel.awaitMessages(filter, { maxMatches: 1, time: 60000, errors: ['time'] })
        .then(collected => {
          member.removeRole("619257593617055766");
          console.log(user.tag+` прошел проверку`);
          mess.channel.send(embs);
          mess.channel.send(embs1);
          mess.channel.send(embs2);
          mess.channel.send(embs3);
        })
        .catch(collected => {
          let embeds = new Discord.RichEmbed().setDescription('Вы не успели ввести ответ за одну минуту.\nВам придется пройти в канал [Верификация](https://discordapp.com/channels/617776960097091783/650795326298521640) и заново нажать на ✅. И ввести правильный ответ.');
          mess.channel.send(embeds);
          console.log(user.tag+` не прошел проверку`);
        });

   await fs.unlink(`verify.png`, (err) => {
  // if (err) console.log(err); // если возникла ошибка    
  //  else console.log("verify.png was deleted");
  });
});
  //console.log( answer);

});
/*bot.on("message", async message => {
  const attachment = new Discord.Attachment(`${__dirname}/verifys.gif`, 'verifys.gif');
   //let embeds = new Discord.RichEmbed().setColor(3553599).setImage(`https://cdn.discordapp.com/attachments/631824687348842496/652230112405618709/12.gif`)
   let embed = new Discord.RichEmbed().setTitle(`Верификационное сообщение!`).attachFile(attachment)
    .setColor(3553599).setDescription("Нажав на ✅ ниже, вы соглашаетесь с правилами этого сервера, которые находятся в канале [Правила](https://discordapp.com/channels/617776960097091783/650795497455353896). Также, после нажатия, вы должны подтвердить свою личность, выполнив простое задание. Сообщение с заданием придет сразу после нажатия на реакцию.")
  //  message.channel.send({
    //    files: ['https://cdn.discordapp.com/attachments/631824687348842496/652532661964898304/9912fc9d3a77441e.gif']
    // });
  let eml = await message.channel.send(embed);
  await eml.react(`✅`)
});
*/

bot.login("NjUxMTU0Nzk4OTQyNjE3NjA2.XeqOTw.l2c_kPyeLZetSCu3-ge1UCMtIgk");