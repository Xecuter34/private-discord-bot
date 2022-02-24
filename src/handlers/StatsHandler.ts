import { MessageEmbed } from "discord.js";
import { RainbowSixAPI } from "../API/RainbowSixAPI";
import { PlatformAll } from "../interfaces/Platforms";
import { RainbowSix } from "../utils/GameRefs";

export class StatsHandler {
  private _rainbowSixAPI = new RainbowSixAPI();

  getPlayerStats = async (game: string, platform: PlatformAll, id: string): Promise<MessageEmbed | null> => {
    switch (true) {
      case (RainbowSix.includes(game)):
        const stats = (await this._rainbowSixAPI.getPlayerStats(id, platform));
        if (!stats || stats === null) {
          return null;
        }

        const seasonal = stats.seasonal !== null 
        ? [
            { name: 'Kills (Seasonal)', value: stats.seasonal.kills.toString(), inline: true },
            { name: 'Deaths (Seasonal)', value: stats.seasonal.deaths.toString(), inline: true },
            { name: 'K/D (Seasonal)', value: stats.seasonal.kd.toString(), inline: true },
            { name: 'MMR', value: stats.seasonal.mmr.toString() }
          ]
        : [
            { name: "Season Not Started", value: 'No Matches have been played yet.' }
          ]

        return new MessageEmbed()
          .setColor('#4DB6AC')
          .setTitle(`${stats.username}'s Stats`)
          .setURL(`https://r6stats.com/stats/${stats.ubisoft_id}/`)
          .setThumbnail(stats.avatar)
          .addFields([
            { name: 'Username', value: stats.username },
            { name: 'Level', value: stats.progression.level.toString() },
            ...seasonal
          ]);
      default: 
        return null;
    }
  }
}