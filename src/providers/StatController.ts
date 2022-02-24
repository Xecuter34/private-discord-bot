import { RainbowSixAPI } from "../API/RainbowSixAPI";
import { handler_stats, PrismaClient, user_handlers } from "@prisma/client";
import { PlatformAll } from "../interfaces/Platforms";
import { v4 } from "uuid";

export class StatsController {
  private _ms: number;
  private _userHandlers: Array<user_handlers> = [];
  private _prismaClient = new PrismaClient();
  private _rainbowSixAPI = new RainbowSixAPI();

  constructor(milliseconds: number) {
    this._ms = milliseconds;
    this._prismaClient.user_handlers.findMany().then(res => {
      this._userHandlers = res;
      this.getStats();
      console.log('Stat Controller Initialized.');
    });
  }

  getStats = async () => {
    console.log('Fetching Stats Started...');
    for (let i = 0; i < this._userHandlers.length; i++) {
      const user = this._userHandlers[i];
      await this.verifyHandler(user);
      await this.saveRainbowSixStats(user.platform_name, user.platform as PlatformAll, user);
    };

    setTimeout(() => {
      this.getStats();
    }, this._ms);
    console.log('Fetching Stats Finished, fetching again in 30 seconds...');
  }

  verifyHandler = async (userHandler: user_handlers) => {
    if (await this._prismaClient.handler_stats.findFirst({
      where: {
        handler_id: userHandler.id
      }
    }) === null) {
      await this._prismaClient.handler_stats.create({
        data: {
          id: v4(),
          handler_id: userHandler.id,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
    }
  }

  saveRainbowSixStats = async (username: string, platform: PlatformAll, userHandler: user_handlers) => {
    const playerStats = await this._rainbowSixAPI.getPlayerStats(username, platform);
    const handlerStats = await this._prismaClient.handler_stats.findFirst({
      where: {
        handler_id: userHandler.id
      }
    });
    if (!playerStats) return;
    if (playerStats !== null) {
      Object.keys(playerStats.progression).forEach(async ps => {
        const key = await this._prismaClient.stat_metrics.findFirst({
          where: {
            name: ps
          }
        });
        if (key === null) {
          this._prismaClient.stat_metrics.create({
            data: {
              name: ps
            }
          });
        }
      });
    }

    if (playerStats.seasonal !== null) {
      Object.keys(playerStats.seasonal).forEach(async ps => {
        const key = await this._prismaClient.stat_metrics.findFirst({
          where: {
            name: ps
          }
        });
        if (key === null) {
          this._prismaClient.stat_metrics.create({
            data: {
              name: ps
            }
          });
        }
      });
    }

    Object.entries(playerStats.progression).forEach(async ([key, value]) => { this.insertStatMetric(key, value, handlerStats); });

    if (playerStats.seasonal !== null) {
      Object.entries(playerStats.seasonal).forEach(async ([key, value]) => { this.insertStatMetric(key, value, handlerStats); });
    }
  }

  insertStatMetric = async(key: string, value: number, handlerStats: handler_stats | null) => {
    const statMetric = await this._prismaClient.stat_metrics.findFirst({
      where: {
        name: key
      }
    });
    if (statMetric !== null && handlerStats !== null) {
      this._prismaClient.handler_stat_values.create({
        data: {
          stat_id: handlerStats.id,
          metric_id: statMetric.id,
          value,
          created_at: new Date(),
          updated_at: new Date()
        }
      })
    }
  }
}