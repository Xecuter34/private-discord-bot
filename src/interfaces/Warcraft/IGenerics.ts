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