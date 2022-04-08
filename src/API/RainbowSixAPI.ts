import { PlatformAll, Platform } from "../interfaces/Platforms";
import R6API from 'r6api.js'
import { SeasonId } from "r6api.js/dist/typings";

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
  private _siegeLiveSeason: SeasonId;

  constructor() {
    const liveSeason = process.env.RAINBOW_SIX_LIVE_SEASON;
    if (!liveSeason) {
      this._siegeLiveSeason = 6;
      return;
    };
    this._siegeLiveSeason = parseInt(liveSeason) as SeasonId
  }

  getPlayerStats = async (id: string, platform: PlatformAll) => {
    try {
      console.log(`Attempting to fetch player stats for ${id}`);
      const userData: Array<R6UserData> = await r6api.findByUsername(platform, id);
      if (userData.length === 0) return null;

      const userPlatform = userData[0].platform as Omit<PlatformAll, 'steam' | 'epic' | 'amazon'> as Platform
      const progressionData = await r6api.getProgression(userPlatform, userData[0].id);

      const seasonalData = await r6api.getRanks(userPlatform, userData[0].id);
      const latestSeasonalData = seasonalData[0].seasons[this._siegeLiveSeason].regions.emea.boards.pvp_ranked;
      const playerSeasonData = latestSeasonalData.lastMatch.result !== 'unknown' 
        ? latestSeasonalData
        : null;
      console.log(`Completed fetching player stats for ${id}`);
      return {
        username: userData[0].username,
        ubisoft_id: userData[0].id,
        avatar: userData[0].avatar[256],
        progression: {
          level: progressionData[0].level
        },
        seasonal: playerSeasonData
      }
    } catch (err: any) {
      console.error(`Failed to fetch player stats: ${err.message}`);
    }
  }
}