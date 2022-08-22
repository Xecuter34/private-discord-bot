import { MessageHandler } from '../handlers/MessageHandler';
import { SteamServerHandler } from '../handlers/SteamServerHandler';
import { Users as UsersComponent } from '../components/users';
import { Command } from '../interfaces/Command';
import { Client, Message, TextChannel } from 'discord.js';
import { isMatt, isValidPlatform } from '../utils/Validators';
import { BuildCommandHelpMessage, BuildHelpMessage } from '../components/help';
import { handleAdditionalParams } from '../utils/Global';
import { StatsHandler } from './StatsHandler';
import { PlatformAll } from '../interfaces/Platforms';

export class CommandHandler {
  messageHandler: MessageHandler;
  users: UsersComponent;
  statsHandler: StatsHandler;
  client: Client;
  channel: string;

  constructor(messageHandler: MessageHandler, users: UsersComponent, client: Client, channel: string) {
    this.messageHandler = messageHandler;
    this.users = users;
    this.statsHandler = new StatsHandler();
    this.client = client;
    this.channel = channel;
  }

  public async handle(command: Command, msg: Message<boolean>, args: string[]): Promise<void> {
    this.messageHandler.setMessage(msg);
    this.messageHandler.setCommand(command);

    switch(command) {
      case 'ping':
        await this.messageHandler.ping();
        break;
      case 'react':
        await msg.react('👌');
        break;
      case 'king':
        if (isMatt(msg.author.id)) {
          await this.messageHandler.reply('Thou think yourself the king, alas, thou art naught but a false king!');
        } else {
          await this.messageHandler.reply('One tells of a false king who thinks he rules over the land, this is not the true king for they art yet to reveal themselves.');
        }
        break;
      case 'name':
        const type = args.shift()?.toLowerCase();
        const value = args.join(' ');
        if (type === 'get') {
          this.users.getUserName(msg.author.id);
        } else if (type === 'set') {
          this.users.setUserName(msg.author.id, value, msg.author.username);
        }
        break;
      case 'stats':
        const game = args.shift()?.toLowerCase();
        const platform = args.shift()?.toLowerCase() as PlatformAll;
        const tArgs = args.join(' ');
        let username = tArgs.split('/params')[0].trim();
        const additionalParams = handleAdditionalParams(tArgs.split('/params')[1]?.trim());
        if (!game || !platform) {
          await msg.reply('I am sorry, I\'m not sure what thou is trying to refer to.');
          break;
        }

        if (game == 'siege' && !isValidPlatform(platform)) {
          await msg.reply('I am sorry, I\'m not sure what thou is trying to refer to.');
          break;
        }

        if (!username) {
          username = msg.author.username;
        }

        const embedMessage = await this.statsHandler.getPlayerStats(game, platform, username, msg.author.id, additionalParams);
        if (embedMessage === null) {
          await msg.reply('I am sorry, I\'m not able to find stats for thou adventurer thou refers to.');
          break;
        }

        this.messageHandler.sendEmbedMessage(this.client.channels.cache.find((c: any) => c.name === this.channel) as TextChannel, embedMessage);
        break;
      case 'server':
        const command = args.shift()?.toLowerCase();

        if (command === 'info') {
          const serverInfo = await new SteamServerHandler().getGmodTTTServer();
          await this.messageHandler.sendMessage(this.client.channels.cache.find((c: any) => c.name === this.channel) as TextChannel, `${serverInfo.Name} is running ${serverInfo.Game} on ${serverInfo.Map}`);
          break;
        }
      case 'help':
        const commandName = args.shift()?.toLowerCase();
        if (!commandName) {
          await this.messageHandler.sendEmbedMessage(this.client.channels.cache.find((c: any) => c.name === this.channel) as TextChannel, BuildHelpMessage());
          break;
        }

        await this.messageHandler.sendEmbedMessage(
          this.client.channels.cache.find((c: any) => c.name === this.channel) as TextChannel, 
          BuildCommandHelpMessage(commandName as Command)
        );
        break;
      default: 
        await msg.reply('I am sorry, I\'m not sure what thou means to communitcate.');
        break;
    }
  }
}