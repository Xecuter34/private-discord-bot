import { MessageHandler } from "../handlers/MessageHandler";
import { getDiscordUser, getUsers, insertDiscordUser, upsertUser, getUserByDiscordId } from "../utils/DAL";
import { isMatt } from "../utils/Validators";
import { v4 } from "uuid";

export class Users {
  private _messgeHandler: MessageHandler;

  constructor(messageHandler: MessageHandler) {
    this._messgeHandler = messageHandler;
  }
  
  setUserName = async (id: string, name: string, handle: string): Promise<void> => {
    if (await getDiscordUser(id) === null && await getUserByDiscordId(id) === null) {
      await insertDiscordUser(id, handle);
      await upsertUser(id, handle, v4());
    }

    const user = await getUserByDiscordId(id);
    if (user === null) {
      this._messgeHandler.reply('For some reason I cannot find thou user, please report this as a bug.');
      return;
    }

    if (isMatt(id)) {
      if (name.toLowerCase().includes('king')) {
        await upsertUser(id, 'Peasent', user.id);
        this._messgeHandler.reply('You are not thou king! I shall refer to you as peasent!');
        return;
      }
    }

    await upsertUser(id, name, user.id);
    this._messgeHandler.reply(`I shall try my best to remember thou name!`);
  }

  getUserName = async (id: string) => {
    const user = await getUserByDiscordId(id);
    if (user === null) {
      this._messgeHandler.reply('I can\'t seem to recall your name, might you tell me what it was? (Set with: `.traveller name set \'Your name here\'`)');
      return;
    };
    
    this._messgeHandler.reply(`I remember thy name, thy name was ${user.username}, right?`);
  }

  getUserCount = async () => {
    const users = await getUsers();
    this._messgeHandler.reply(`I can recall a total of ${users.length} adventurer${users.length > 1 ? 's' : ''}`)
  }
}