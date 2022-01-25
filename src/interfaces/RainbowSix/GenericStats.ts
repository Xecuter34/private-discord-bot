import { Bomb, Hostage, SecureArea } from "./Gamemodes";

export interface GenericStats {
  bomb: Bomb;
  hostage: Hostage;
  secure_area: SecureArea;
}