import { PlatformAll, Platform } from "../interfaces/Platforms";
import R6API from 'r6api.js'

const email = process.env.UBI_EMAIL;
const password = process.env.UBI_PASSWORD;
const r6api = new R6API({email, password});

interface R6UserData {
  id: string;
  userId: string;
  idOnPlatform: string;
  platform: "uplay" | "psn" | "xbl" | "steam" | "epic" | "amazon";
  username: string;
  avatar: {
    146: string;
    256: string;
    500: string;
  };
}

export class RainbowSixAPI {
  getPlayerStats = async (id: string, platform: PlatformAll) => {
    const userData: Array<R6UserData> = await r6api.findByUsername(platform, id);
    if (userData.length === 0) return null;

    const userPlatform = userData[0].platform as Omit<PlatformAll, 'steam' | 'epic' | 'amazon'> as Platform
    const progressionData = await r6api.getProgression(userPlatform, userData[0].id);

    const seasonalData = await r6api.getRanks(userPlatform, userData[0].id);
    const latestSeasonalData = seasonalData[0].seasons[24].regions.emea.boards.pvp_ranked;
    const playerSeasonData = latestSeasonalData.lastMatch.result !== 'unknown' 
      ? {
        kills: latestSeasonalData.kills,
        deaths: latestSeasonalData.deaths,
        kd: latestSeasonalData.kd,
        mmr: latestSeasonalData.current.mmr
      }
      : null;
    return {
      username: userData[0].username,
      ubisoft_id: userData[0].idOnPlatform,
      avatar: userData[0].avatar[256],
      progression: {
        level: progressionData[0].level
      },
      seasonal: playerSeasonData
    }
  }
}