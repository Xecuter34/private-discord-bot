import { IGeneric, IHref, IKeyValue, ILink, ICharacter } from "../IGenerics";

export interface ICharacterMediaResponse {
  _links: ILink;
  character: ICharacter;
  assets: IKeyValue[];
}