import { PlatformAll } from "../interfaces/Platforms";

export const isMatt = (id: string) => {
  return id === '350753691940290581';
}

export const isValidPlatform = (platform: PlatformAll) => {
  return Object.values(PlatformAll).includes(platform);
}