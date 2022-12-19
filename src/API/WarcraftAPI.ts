import { wow } from 'blizzard.js';
import { ICharacterProfileResponse } from '../interfaces/Warcraft/Responses/ICharacterProfileResponse';
import { ICharacterPvPResponse } from '../interfaces/Warcraft/Responses/ICharacterPvPResponse';
import { IRealmResponse } from '../interfaces/Warcraft/Responses/IRealmResponse';
import { ICharacterMediaResponse } from '../interfaces/Warcraft/Responses/ICharacterMediaResponse';
import axios from 'axios';

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

  getCurrentSeasonalStats = async (username: string, realm: string, bracket: string): Promise<ICharacterPvPResponse | undefined> => {
    try {
      if (!this._warcraftClient) {
        console.log('Warcraft client is not initialized');
        return;
      }

      const pvpData = (await this._warcraftClient.characterPVP<ICharacterPvPResponse>({
        realm: realm,
        name: username,
        bracket: bracket
      })).data

      return pvpData;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  getRealms = async (): Promise<IRealmResponse | undefined> => {
    try {
      if (!this._warcraftClient) {
        console.log('Warcraft client is not initialized');
        return;
      }
  
      const realms = (await this._warcraftClient.realm<IRealmResponse>()).data
      return realms;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  getCharacterProfile = async (username: string, realmSlug: string): Promise<ICharacterProfileResponse | undefined> => {
    try {
      if (!this._warcraftClient) {
        console.log('Warcraft client is not initialized');
        return;
      }
  
      const profile = (await this._warcraftClient.characterProfile<ICharacterProfileResponse>({
        realm: realmSlug,
        name: username
      })).data;
  
      return profile;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  getCharacterMedia = async (username: string, realmSlug: string): Promise<ICharacterMediaResponse | undefined> => {
    try {
      if (!this._warcraftClient) {
        console.log('Warcraft client is not initialized');
        return;
      }
  
      const media = (await this._warcraftClient.characterMedia<ICharacterMediaResponse>({
        realm: realmSlug,
        name: username
      })).data;
  
      return media;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  getHrefData = async <T>(href: string) => {
    try {
      if (!this._warcraftClient) {
        console.log('Warcraft client is not initialized');
        return;
      }
  
      const token = (await this._warcraftClient.getApplicationToken()).data.access_token;
      const hrefData: T = (await axios(href, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })).data;

      return hrefData;
    } catch (error) {
      console.error(error);
      return;
    }
  }
}