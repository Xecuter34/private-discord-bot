import { SteamServerAPI } from '../API/SteamServerAPI';
import { A2S_INFO } from "../interfaces/Steam/A2S_INFO";

export class SteamServerHandler {
  _api: SteamServerAPI;

  constructor () { 
    this._api = new SteamServerAPI();
  }

  getGmodTTTServer = async (): Promise<A2S_INFO> => {
    const serverInfo = await this._api.getServerInfo('35.178.222.15', 27015);
    return {
      Header: serverInfo.header,
      Protocol: serverInfo.protocol,
      Name: serverInfo.serverName,
      Map: serverInfo.map,
      Folder: serverInfo.gameDir,
      Game: serverInfo.gameName,
      ID: serverInfo.serverID,
      Players: serverInfo.numPlayers,
      MaxPlayers: serverInfo.maxPlayers,
      Bots: serverInfo.numBots,
      ServerType: serverInfo.serverType,
      Environment: serverInfo.environment,
      Visibility: serverInfo.visibility,
      VAC: serverInfo.VAC,
      Version: serverInfo.version,
      EDF: serverInfo.EDF
    };
  }
}