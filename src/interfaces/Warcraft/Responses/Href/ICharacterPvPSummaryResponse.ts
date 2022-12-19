import { IHref, IMatchStatistics, IWorldMap, ICharacter, ILocale } from "../../IGenerics";

export interface ICharacterPvPSummaryResponse {
  _links: {
    self: IHref;
  };
  brackets: Array<IHref>;
  character: ICharacter;
  honor_level: number;
  honorable_kills: number;
  pvp_map_statistics: Array<{
    match_statistics: Array<IMatchStatistics>;
    world_map: IWorldMap;
  }>;
}