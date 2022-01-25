import { GenericStats } from "./GenericStats";
import { ProgressionStats } from "./ProgressionStats";
import { SeasonalStats } from "./SeasonalStats";

export interface PlayerSearch {
  avatar_banned: boolean;
  avatar_url_146: string;
  avatar_url_256: string;
  claimed: boolean;
  genericStats: GenericStats;
  last_updated: string;
  platform: string;
  progressionStats: ProgressionStats;
  seasonalStats: SeasonalStats;
  ubisoft_id: string;
  uplay_id: string;
  username: string;
}