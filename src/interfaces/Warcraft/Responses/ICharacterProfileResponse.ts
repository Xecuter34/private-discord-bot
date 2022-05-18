import { ICovenantProgress, IGeneric, IHref, ILink, ITypeName } from "../IGenerics";

export interface ICharacterProfileResponse {
  _links: ILink
  id: number;
  name: string;
  gender: ITypeName
  faction: ITypeName
  race: IGeneric;
  character_class: IGeneric;
  active_spec: IGeneric;
  realm: IGeneric;
  level: number;
  experience: number;
  achievement_points: number;
  achievements: IHref;
  titles: IHref;
  pvp_summary: IHref;
  encounters: IHref;
  media: IHref;
  last_login_timestamp: number;
  average_item_level: number;
  equipped_item_level: number;
  specializations: IHref;
  statistics: IHref;
  mythic_keystone_profile: IHref;
  equipment: IHref;
  appearance: IHref;
  collections: IHref;
  active_title: IGeneric;
  reputations: IHref;
  quests: IHref;
  achievements_statistics: IHref;
  professions: IHref;
  covenant_progress: ICovenantProgress;
}