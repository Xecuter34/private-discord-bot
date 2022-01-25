import { Client, TextChannel, MessageEmbed } from 'discord.js';
import { config } from 'dotenv';
import { Users as UsersComponent } from './components/users';
import { MessageHandler as MsgHandler } from './handlers/MessageHandler';
import { StatsHandler } from './handlers/StatsHandler';
import { Command } from './interfaces/Command';
import { User } from './interfaces/User';
import { isMatt, isValidPlatform } from './utils/Validators';
import { RainbowSix } from './utils/GameRefs';
import { Platforms } from './interfaces/Platforms';
config();

// Matt's Discord ID: 350753691940290581
const channel = process.env.ENV === 'development' ? 'bot-testing' : 'general';
const PREFIX = process.env.PREFIX ?? '';
const client = new Client({ intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES'] });
let MessageHandler: MsgHandler;
let Users: UsersComponent;

const StatHandler = new StatsHandler();

client.on('ready', async () => {
  MessageHandler = new MsgHandler(client);
  Users = new UsersComponent(MessageHandler);
  console.log(`Logged in as user ${client.user?.tag}`);
  MessageHandler.sendMessage(client.channels.cache.find((c: any) => c.name === channel) as TextChannel, 'I have finally arrived, pray dost not mind me.');
});

client.on('message', async msg => {
  if (!msg.content.startsWith(PREFIX)) return;

  const args = msg.content.slice(PREFIX.length).split(/ +/);
  if (args[0].trim() === '') {
    args.shift();
  }
  const command: Command = args.shift()?.toLowerCase() as Command;
  MessageHandler.setMessage(msg);
  MessageHandler.setCommand(command);

  switch(command) {
      case 'ping':
        await MessageHandler.ping();
        break;
      case 'react':
        await msg.react('👌');
        break;
      case 'king':
        if (isMatt(msg.author.id)) {
          await MessageHandler.reply('Thou think yourself the king, alas, thou art naught but a false king!');
        } else {
          await MessageHandler.reply('One tells of a false king who thinks he rules over the land, this is not the true king for they art yet to reveal themselves.');
        }
        break;
      case 'name':
        const type = args.shift()?.toLowerCase();
        const value = args.join(' ');
        if (type === 'get') {
          Users.getUserName(msg.author.id);
        } else if (type === 'set') {
          Users.setUserName(msg.author.id, value, msg.author.username);
        }
        break;
      case 'stats':
        const game = args.shift()?.toLowerCase();
        const platform = args.shift()?.toLowerCase() as Platforms;
        let username = args.shift();
        if (!game || !platform && isValidPlatform(platform)) {
          await msg.reply('I am sorry, I\'m not sure what thou is trying to refer to.');
          break;
        }

        if (!username) {
          username = msg.author.username;
        }

        const stats = await StatHandler.getPlayerStats(game, platform, username);
        if (stats === null) {
          await msg.reply('I am sorry, I\'m not able to find stats for thou adventurer thou refers to.');
          break;
        }

        const embedMessage = new MessageEmbed()
          .setColor('#4DB6AC')
          .setTitle(`${username}'s Stats`)
          .setURL(`https://r6stats.com/stats/${stats.ubisoft_id}/`)
          .setThumbnail(stats.avatar_url_256)
          .addFields([
            { name: 'Username', value: stats.username },
            { name: 'Level', value: stats.progressionStats.level.toString() },
            { name: 'Kills (Seasonal)', value: stats.seasonalStats.kills.toString(), inline: true },
            { name: 'Deaths (Seasonal)', value: stats.seasonalStats.deaths.toString(), inline: true },
            { name: 'K/D (Seasonal)', value: String((stats.seasonalStats.kills / stats.seasonalStats.deaths).toFixed(2)), inline: true },
            { name: 'MMR', value: stats.seasonalStats.mmr.toString() }
          ]);
        MessageHandler.sendEmbedMessage(client.channels.cache.find((c: any) => c.name === channel) as TextChannel, embedMessage);
        break;
      default: 
        await msg.reply('I am sorry, I\'m not sure what thou means to communitcate.');
        break;
    }
});

client.login(process.env.TOKEN);