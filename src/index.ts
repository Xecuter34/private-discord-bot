import { Client, TextChannel } from 'discord.js';
import { config } from 'dotenv';
import { Users as UsersComponent } from './components/users';
import { MessageHandler as MsgHandler } from './handlers/MessageHandler';
import { Command } from './interfaces/Command';
import { User } from './interfaces/User';
import { isMatt } from './utils/Validators';
config();

// Matt's Discord ID: 350753691940290581
const channel = process.env.ENV === 'development' ? 'bot-testing' : 'general';
const PREFIX = process.env.PREFIX ?? '';
const client = new Client({ intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES'] });
let MessageHandler: MsgHandler;
let Users: UsersComponent;

const users: Record<string, User> = {};

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
      default: 
        await msg.reply('I am sorry, I\'m not sure what thou means to communitcate.');
        break;
    }
});

client.login(process.env.TOKEN);