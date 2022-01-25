import { RainbowSixAPI } from "../API/RainbowSixAPI";
import { Platforms } from "../interfaces/Platforms";
import { RainbowSix } from "../utils/GameRefs";

export class StatsHandler {
  private _rainbowSixAPI = new RainbowSixAPI();

  getPlayerStats = async (game: string, platform: Platforms, id: string) => {
    switch (true) {
      case (RainbowSix.includes(game)):
        return (await this._rainbowSixAPI.getPlayerStats(id, platform))[0];
      default: 
        return null;
    }
  }
}