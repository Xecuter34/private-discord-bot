import { IGeneric, ILink } from "../IGenerics";

export interface IRealmResponse {
  _links: ILink;
  realms: IGeneric[];
}