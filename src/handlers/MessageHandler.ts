import { Message } from "discord.js";
import { ping as componentPing } from '../components/ping';
import { Command } from '../interfaces/Command';

export class MessageHandler {
  _message: Message;
  _command: Command;

  constructor(message: Message, command: Command) {
    this._message = message;
    this._command = command;
  }

  ping = async (): Promise<void> => {
    await componentPing(this._message);
  }
}