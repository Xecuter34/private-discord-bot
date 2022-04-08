import { wow } from 'blizzard.js';

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

  getCurrentSeasonalStats = async (username: string): Promise<any> => {
      if (!this._warcraftClient) {
        console.log('Warcraft client is not initialized');
        return;
      }

      const pvpSeason = await this._warcraftClient.pvpSeason();

      return pvpSeason;
  }
}