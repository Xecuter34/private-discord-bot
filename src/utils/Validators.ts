import { Platforms } from "../interfaces/Platforms";

export const isMatt = (id: string) => {
  return id === '350753691940290581';
}

export const isValidPlatform = (platform: Platforms) => {
  return Object.values(Platforms).includes(platform);
}