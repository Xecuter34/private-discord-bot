import { Client, TextChannel } from 'discord.js';
import { config } from 'dotenv';
import { Users as UsersComponent } from './components/users';
import { MessageHandler as MsgHandler } from './handlers/MessageHandler';
import { StatsHandler } from './handlers/StatsHandler';
import { Command } from './interfaces/Command';
//import { StatsController } from './providers/StatController';
import { CommandHandler as CmdHandler } from './handlers/CommandHandler';
config();

// Matt's Discord ID: 350753691940290581
const channel = process.env.ENV === 'development' ? 'bot-testing' : 'general';
const PREFIX = process.env.PREFIX ?? '';
const client = new Client({ intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES'] });
let MessageHandler: MsgHandler;
let Users: UsersComponent;
let CommandHandler: CmdHandler;

const StatHandler = new StatsHandler();
// new StatsController(30000);

client.on('ready', async () => {
  MessageHandler = new MsgHandler(client);
  Users = new UsersComponent(MessageHandler);
  CommandHandler = new CmdHandler(MessageHandler, Users, client, channel);
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
  CommandHandler.handle(command, msg, args); 
});

client.login(process.env.TOKEN);