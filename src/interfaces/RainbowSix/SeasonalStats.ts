export interface SeasonalStats {
  abandons: number;
  champions_rank_position: number;
  created_at: string;
  created_for_date: string;
  deaths: number;
  kills: number;
  last_match_mmr_change: number;
  last_match_skill_mean_change: number;
  last_match_skill_standard_deviation_change: number;
  losses: number;
  max_mmr: number;
  max_rank: number;
  mmr: number;
  next_rank_mmr: number;
  prev_rank_mmr: number;
  rank: number;
  region: string;
  skill_mean: number;
  skill_standard_deviation: number;
  updated_at: string;
  wins: number;
}