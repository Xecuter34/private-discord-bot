import { wow } from 'blizzard.js';
import { ICharacterPvPResponse } from '../interfaces/Warcraft/ICharacterPvPResponse';
import { IPvPSeasonResponse } from '../interfaces/Warcraft/IPvPSeasonResponse';

export class WarcraftAPI {
  private _warcraftCurrentSeason: number;
  private _warcraftClient: wow.WoWClient | null = null;

  constructor() {
    this._warcraftCurrentSeason = 31;
    wow.createInstance({
      key: process.env.BLIZZARD_CLIENT_ID ?? '',
      secret: process.env.BLIZZARD_CLIENT_SECRET ?? '',
      origin: 'eu',
      locale: 'en_US',
    }).then(client => {
      this._warcraftClient = client;
    });
  }

  getCurrentSeasonalStats = async (username: string): Promise<ICharacterPvPResponse | undefined> => {
      if (!this._warcraftClient) {
        console.log('Warcraft client is not initialized');
        return;
      }

      const pvpData = (await this._warcraftClient.characterPVP<ICharacterPvPResponse>({
        realm: 'draenor',
        name: username,
        bracket: '2v2'
      })).data

      return pvpData;
  }
}