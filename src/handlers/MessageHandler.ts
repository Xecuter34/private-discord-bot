import { Client, Message, TextChannel, MessageEmbed } from "discord.js";
import { ping as componentPing } from '../components/ping';
import { Command } from '../interfaces/Command';

export class MessageHandler {
  _message: Message | null = null;
  _command: Command | null = null;
  _client: Client;

  constructor(client: Client) {
    this._client = client;
  }

  setMessage = (message: Message) => {
    this._message = message;
  }

  setCommand = (command: Command) => {
    this._command = command;
  }

  ping = async (): Promise<void> => {
    if (!this._message) return;
    await componentPing(this._message);
  }

  sendMessage = async (channel: TextChannel, message: string): Promise<void> => {
    if (message.trim() === '') return;
    await channel.send(message);
  }

  reply = async (message: string): Promise<void> => {
    if (message.trim() === '') return;
    await this._message?.reply(message);
  }

  sendEmbedMessage = async (channel: TextChannel, embed: MessageEmbed): Promise<void> => {
    await channel.send({
      embeds: [embed]
    });
  }
}