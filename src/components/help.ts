import { MessageEmbed } from "discord.js"
import { Command } from "../interfaces/Command";

export const BuildHelpMessage = () => {
  return new MessageEmbed()
    .setColor('#4DB6AC')
    .setTitle('Help Command')
    .addFields([
      { name: 'Everyone commands', value: '`king`, `name`, `stats`' },
    ])
    .setFooter({ text: 'Type \'.traveller help <CommandName>\' for details on a command' });
}

export const BuildCommandHelpMessage = (command: Command) => {
  const commandFields: Array<{ name: string, value: string }> = [];
  switch (command) {
    case 'king':
      commandFields.push({
        name: '.traveller king',
        value: 'Tell a legend about a false king.'
      });
      break;
    case 'name':
      commandFields.push({
        name: '.traveller name <Command> <Optional:Name>',
        value: 'Get or sets your name that the bot will refer to you as.'
      });
      commandFields.push({
        name: 'Command',
        value: '`get`, `set`'
      });
      break;
    case 'stats':
      commandFields.push({
        name: '.traveller stats <Game> <Platform> <Username>',
        value: 'Get stats for a specific user based on game/platform.'
      });
      commandFields.push({
        name: 'Platforms',
        value: '`uplay`, `xbl`, `psn`, `pc`'
      });
      commandFields.push({
        name: 'Supported Games',
        value: '`siege`, `warcraft`'
      });
      commandFields.push({
        name: 'Additional Params',
        value: '/params <Additional Params Here>'
      });
      break;
    default:
      break;
  }

  return new MessageEmbed()
    .setColor('#4DB6AC')
    .setTitle(`Help Command: ${command}`)
    .addFields(commandFields);
}