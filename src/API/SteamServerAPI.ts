import query from 'source-server-query';

export class SteamServerAPI {
  private _timeout: number;

  constructor() { 
    this._timeout = 1000;
  }

  public async getServerInfo(ip: string, port: number): Promise<Record<string, any>> {
    return await query.info(ip, port, this._timeout);
  }

  public async getServerPlayers(ip: string, port: number): Promise<Record<string, any>> {
    return await query.players(ip, port, this._timeout);
  }

  public async getServerRules(ip: string, port: number): Promise<Record<string, any>> {
    return await query.rules(ip, port, this._timeout);
  }
}