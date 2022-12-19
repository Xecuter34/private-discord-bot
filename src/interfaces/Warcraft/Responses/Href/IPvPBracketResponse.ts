import { IBracket, ICharacter, IFaction, IHref, IMatchStatistics, ISpecialization, ITier } from "../../IGenerics";
import { ISeason } from "../IPvPSeasonResponse";

export interface IPvPBracketResponse {
  _links: {
    self: IHref;
  };
  character: ICharacter;
  faction: IFaction;
  bracket: IBracket;
  rating: number;
  season: ISeason;
  tier: ITier;
  season_match_statistics: IMatchStatistics;
  weekly_match_statistics: IMatchStatistics;
  specialization: ISpecialization;
  season_round_statistics: IMatchStatistics;
  weekly_round_statistics: IMatchStatistics;
}