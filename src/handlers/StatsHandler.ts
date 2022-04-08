import { MessageEmbed } from "discord.js";
import { RainbowSixAPI } from "../API/RainbowSixAPI";
import { PlatformAll } from "../interfaces/Platforms";
import { RainbowSix, WorldOfWarcraft } from "../utils/GameRefs";
import { PrismaClient, user_handlers } from "@prisma/client";
import { v4 } from "uuid";
import { WarcraftAPI } from "../API/WarcraftAPI";

export class StatsHandler {
  private readonly REFRESH_TIME = 14400;

  private _rainbowSixAPI = new RainbowSixAPI();
  private _wowClientAPI = new WarcraftAPI();
  private _prismaClient = new PrismaClient();

  private saveToDatabase = async (stats: Record<string, number>, userHandler: user_handlers): Promise<boolean> => {
    try {
      let handlerStats = await this._prismaClient.handler_stats.findFirst({
        where: {
          handler_id: userHandler.id
        }
      });

      if (!handlerStats) {
        handlerStats = await this._prismaClient.handler_stats.create({
          data: {
            id: v4(),
            handler_id: userHandler.id,
            created_at: new Date(),
            updated_at: new Date(),
          }
        });
      }

      Object.keys(stats).map(async key => {
        let statMetric = await this._prismaClient.stat_metrics.findFirst({
          where: {
            slug: key
          }
        });

        if (!statMetric) {
          statMetric = await this._prismaClient.stat_metrics.create({
            data: {
              slug: key,
              name: key.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
              disabled: false
            }
          });
        }

        if (statMetric.disabled) {
          return;
        }

        if (!handlerStats?.id) {
          return;
        }

        const latestStatValue = await this._prismaClient.handler_stat_values.findFirst({
          where: {
            stat_id: handlerStats?.id
          },
          select: {
            created_at: true
          }
        });

        if (latestStatValue?.created_at && latestStatValue?.created_at > new Date(Date.now() - this.REFRESH_TIME * 1000)) {
          console.log(`Stat for ${key} was updated too recently.`);
          return;
        }

        await this._prismaClient.handler_stat_values.create({
          data: {
            stat_id: handlerStats?.id,
            metric_id: statMetric.id,
            value: stats[key],
            created_at: new Date(),
            updated_at: new Date()
          }
        });
      });

      return true;
    } catch (err) {
      console.error(`Error saving stats to database: ${err}`);
      return false;
    }
  }

  getPlayerStats = async (game: string, platform: PlatformAll, username: string, discordId: string): Promise<MessageEmbed | null> => {
    switch (true) {
      case (RainbowSix.includes(game)): {
        const stats = (await this._rainbowSixAPI.getPlayerStats(username, platform));
        if (!stats || stats === null) {
          return null;
        }

        const discordUser = await this._prismaClient.discords.findFirst({
          where: {
            discord_id: discordId
          },
          select: {
            user_discords: {
              select: {
                user_id: true
              }
            }
          }
        })

        let userHandler = await this._prismaClient.user_handlers.findFirst({
          where: {
            user_id: discordUser?.user_discords?.user_id
          }
        });

        if (!userHandler) {
          if (!discordUser || !discordUser.user_discords) {
            return null;
          }

          userHandler = await this._prismaClient.user_handlers.create({
            data: {
              platform_user_id: stats.ubisoft_id,
              platform_username: stats.username,
              platform,
              platform_game: game,
              user_id: discordUser.user_discords.user_id,
            }
          });
        }

        this.saveToDatabase({
          kills: stats.seasonal?.kills ?? 0,
          deaths: stats.seasonal?.deaths ?? 0,
          kd: stats.seasonal?.kd ?? 0,
          mmr: stats.seasonal?.current.mmr ?? 0,
        }, userHandler);

        const seasonal = stats.seasonal !== null 
        ? [
            { name: 'Kills (Seasonal)', value: stats.seasonal.kills.toString(), inline: true },
            { name: 'Deaths (Seasonal)', value: stats.seasonal.deaths.toString(), inline: true },
            { name: 'K/D (Seasonal)', value: stats.seasonal.kd.toString(), inline: true },
            { name: 'MMR', value: stats.seasonal.current.mmr.toString() }
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
        }
      case (WorldOfWarcraft.includes(game)): {
        const pvpSeason = await this._wowClientAPI.getCurrentSeasonalStats(username);

        const seasonal = true ? [
          { name: 'Kills (Seasonal)', value: "stats.seasonal.kills.toString()", inline: true },
          { name: 'Deaths (Seasonal)', value: "stats.seasonal.deaths.toString()", inline: true },
          { name: 'K/D (Seasonal)', value: "stats.seasonal.kd.toString()", inline: true },
          { name: 'MMR', value: "stats.seasonal.current.mmr.toString()" }
        ] : [
          { name: "Season Not Started", value: 'No Matches have been played yet.' }
        ];

        return new MessageEmbed()
          .setColor('#4DB6AC')
          .setTitle(`${username}'s Stats`)
          .setURL(`https://r6stats.com/stats//`)
          .setThumbnail("URL for character")
          .addFields([
            { name: 'Username', value: username },
            { name: 'Level', value: "" },
            ...seasonal
          ]);
        }
      default: 
        return null;
    }
  }
}