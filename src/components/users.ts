import { MessageHandler } from "../handlers/MessageHandler";
import { User } from "../interfaces/User";
import { isMatt } from "../utils/Validators";

export class Users {
  private _users: Record<string, User>;
  private _messgeHandler: MessageHandler;

  constructor(messageHandler: MessageHandler) {
    this._users = {}
    this._messgeHandler = messageHandler;
  }

  get users(): Record<string, User> {
    return this._users;
  }
  
  setUserName = async (id: string, name: string): Promise<void> => {
    if (isMatt(id)) {
      if (name.toLowerCase().includes('king')) {
        this._users[id] = {
          name: 'Peasent'
        }
        this._messgeHandler.reply('You are not thou king! I shall refer to you as peasent!');
        return;
      }
    }

    this._users[id] = { 
      name: name
    }
    this._messgeHandler.reply(`I shall try my best to remember thou name!`);
  }

  getUserName = async (id: string) => {
      if (!this._users[id]) {
        this._messgeHandler.reply('I can\'t seem to recall your name, might you tell me what it was? (Set with: `.traveller name set \'Your name here\'`)');
        return;
      };
      
      this._messgeHandler.reply(`I remember thy name, thy name was ${this._users[id].name}, right?`);
  }
}