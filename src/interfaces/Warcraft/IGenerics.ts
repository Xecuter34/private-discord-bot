export interface ILink {
  self: IHref
}

export interface ITypeName {
  type: string;
  name: string;
}

export interface IKeyValue {
  key: string;
  value: string;
}

export interface IGeneric {
  key: IHref
  name: string;
  id: number;
  slug?: string;
  display_string?: string;
}

export interface IHref {
  href: string;
}

export interface ICovenantProgress {
  chosen_covenant: {
    key: IHref;
    name: string;
    id: number;
  }
  renown_level: number;
  soulbinds: IHref;
}

export interface IMatchStatistics {
  lost: number;
  played: number;
  won: number;
}

export interface IWorldMap {
  id: number;
  name: ILocale;
}

export interface ICharacter {
  key: IHref;
  name: string;
  id: number;
  realm: IGeneric;
}

export interface ILocale {
  de_DE: string;
  en_GB: string;
  en_US: string;
  es_ES: string;
  es_MX: string;
  fr_FR: string;
  it_IT: string;
  ko_KR: string;
  pt_BR: string;
  ru_RU: string;
  zh_CN: string;
  zh_TW: string;
}

export interface IFaction {
  type: string;
  name: ILocale;
}

export interface IBracket {
  id: number;
  type: string;
}

export interface ISeason {
  id: number;
  key: IHref;
}

export interface ITier {
  id: number;
  key: IHref;
}

export interface ISpecialization {
  id: number;
  key: IHref;
  name: ILocale;
}