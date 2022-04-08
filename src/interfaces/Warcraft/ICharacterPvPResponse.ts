export interface ICharacterPvPResponse {
  _links: {
    self: {
      href: string;
    }
  }
  character: {
    key: {
      href: string
    }
    name: string;
    id: number;
    realm: {
      key: {
        href: string;
      }
      name: string;
      id: number;
      slug: string;
    }
  }
  faction: {
    type: string;
    name: string;
  }
  bracket: {
    id: number;
    type: string;
  }
  rating: number;
  season: {
    key: {
      href: string;
    }
    id: number;
  }
  tier: {
    key: {
      href: string;
    }
    id: number;
  }
  season_match_statistics: {
    played: number;
    won: number;
    lost: number;
  }
  weekly_match_statistics: {
    played: number;
    won: number;
    lost: number;
  }
}