export interface IPvPSeasonResponse {
  _links: {
    self: {
      href: string;
    }
  };
  seasons: ISeason[];
  current_season: ISeason;
}

export interface ISeason {
  key: {
    href: string;
  },
  id: number;
}