import { Client } from 'discord.js';
import { config } from 'dotenv';
import { MessageHandler } from './handlers/MessageHandler';
import { Command } from './interfaces/Command';
config();

const PREFIX = process.env.PREFIX ?? '';
const client = new Client({ intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES'] });

client.on('ready', async () => {
  console.log(`Logged in as user ${client.user?.tag}`);
});

client.on('message', async msg => {
  if (!msg.content.startsWith(PREFIX)) return;

  const args = msg.content.slice(PREFIX.length).split(/ +/);
  if (args[0].trim() === '') {
    args.shift();
  }
  const command: Command = args.shift()?.toLowerCase() as Command;

const Message = new MessageHandler(msg, command);

switch(command) {
    case 'ping':
      await Message.ping();
      break;
    case 'react':
      await msg.react('👌');
      break;
    default: 
      await msg.reply('I am sorry, I\'m not sure what thou means to communitcate.');
      break;
  }
});

client.login(process.env.TOKEN);