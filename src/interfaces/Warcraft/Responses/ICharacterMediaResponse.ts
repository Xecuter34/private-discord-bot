import { IGeneric, IHref, IKeyValue, ILink } from "../IGenerics";

export interface ICharacterMediaResponse {
  _links: ILink;
  character: {
    key: IHref;
    name: string;
    id: number;
    realm: IGeneric;
  }
  assets: IKeyValue[];
}