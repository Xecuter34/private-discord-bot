import { MessageEmbed } from "discord.js";
import { RainbowSixAPI } from "../API/RainbowSixAPI";
import { Platforms } from "../interfaces/Platforms";
import { RainbowSix } from "../utils/GameRefs";

export class StatsHandler {
  private _rainbowSixAPI = new RainbowSixAPI();

  getPlayerStats = async (game: string, platform: Platforms, id: string): Promise<MessageEmbed | null> => {
    switch (true) {
      case (RainbowSix.includes(game)):
        const stats = (await this._rainbowSixAPI.getPlayerStats(id, platform))[0];
        if (stats === null) {
          return null;
        }

        const killdeath = !Number.isNaN(stats.seasonalStats.kills / stats.seasonalStats.deaths)
          ? stats.seasonalStats.kills / stats.seasonalStats.deaths
          : 0;

        const seasonal = stats.seasonalStats.last_match_mmr_change !== 0 
        ? [
            { name: 'Kills (Seasonal)', value: stats.seasonalStats.kills.toString(), inline: true },
            { name: 'Deaths (Seasonal)', value: stats.seasonalStats.deaths.toString(), inline: true },
            { name: 'K/D (Seasonal)', value: String(killdeath.toFixed(2)), inline: true },
            { name: 'MMR', value: stats.seasonalStats.mmr.toString() }
          ]
        : [
            { name: "Season Not Started", value: 'No Matches have been played yet.' }
          ]

        return new MessageEmbed()
          .setColor('#4DB6AC')
          .setTitle(`${stats.username}'s Stats`)
          .setURL(`https://r6stats.com/stats/${stats.ubisoft_id}/`)
          .setThumbnail(stats.avatar_url_256)
          .addFields([
            { name: 'Username', value: stats.username },
            { name: 'Level', value: stats.progressionStats.level.toString() },
            ...seasonal
          ]);
      default: 
        return null;
    }
  }
}