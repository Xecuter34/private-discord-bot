export interface A2S_INFO {
  Header: number;
  Protocol: number;
  Name: string;
  Map: string;
  Folder: string;
  Game: string;
  ID: number;
  Players: number;
  MaxPlayers: number;
  Bots: number;
  ServerType: number;
  Environment: number;
  Visibility: number;
  VAC: number;
  Version: string;
  EDF: number;
  Port?: number;
  SteamID?: string;
  GameID?: number;
}