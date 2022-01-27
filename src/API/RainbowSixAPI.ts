import get from 'axios';
import { Platforms } from "../interfaces/Platforms";
import { PlayerSearch } from "../interfaces/RainbowSix/PlayerSearch";
import R6API from 'r6api.js'

// Eventually switch to this as I can get live stats myself...
// const email = process.env.UBI_EMAIL;
// const password = process.env.UBI_PASSWORD;
// const r6api = new R6API({email, password});

export class RainbowSixAPI {
  /**
   * Exmaple URL : https://r6stats.com/api/player-search/${USERNAME}/${PLATFORM}
   */
  private _url = 'https://r6stats.com/api/player-search';

  getPlayerStats = async (id: string, platform: Platforms): Promise<Array<PlayerSearch>> => {
    const res = await get(`${this._url}/${id}/${platform}`);
    if (res.status !== 200) {
      throw new Error('Failed to resovle stats');
    }

    return res.data.data;
  }
}