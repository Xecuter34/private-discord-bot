export interface BaseGamemode {
  best_score: number;
  games_played: number;
  losses: number;
  platime: number;
  wins: number;
  wl: number;
}

export interface Bomb extends BaseGamemode { }

export interface Hostage extends BaseGamemode {
  extraction_denied: number;
}

export interface SecureArea extends BaseGamemode {
  kills_as_attacker_in_objective: number;
  kills_as_defender_in_objective: number;
  times_objective_secured: number;
}