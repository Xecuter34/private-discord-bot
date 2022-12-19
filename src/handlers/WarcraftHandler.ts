import { MessageEmbed } from "discord.js";
import { WarcraftAPI } from "../API/WarcraftAPI";
import { ErrorCodes } from "../interfaces/ErrorCodes";
import { FACTION_COLOR } from "../interfaces/Warcraft/Misc/Colors";
import { WarcraftFallback } from "../interfaces/Warcraft/Misc/Data";
import { ICharacterPvPSummaryResponse } from "../interfaces/Warcraft/Responses/Href/ICharacterPvPSummaryResponse";
import { IPvPBracketResponse } from "../interfaces/Warcraft/Responses/Href/IPvPBracketResponse";

export class WarcraftHandler {
  private readonly REFRESH_TIME = 14400;
  private _wowClientAPI = new WarcraftAPI();
  
  getWarcraftPlayerPvPSeasonalData = async (username: string, realm: string) => {
    const characterData = await this._wowClientAPI.getCharacterProfile(username, realm);
    const characterMediaData = await this._wowClientAPI.getCharacterMedia(username, realm);
    const characterPvPSummary = await this._wowClientAPI.getHrefData<ICharacterPvPSummaryResponse>(characterData?.pvp_summary.href ?? ErrorCodes.NOT_FOUND);

    // const seasonal = pvpCharacterData && pvpCharacterData.season.id === WarcraftData.CURRENT_SEASON ? [
    //   { name: 'Rating (Seasonal)', value: pvpCharacterData.rating.toString(), inline: true },
    //   { name: 'Bracket (Seasonal)', value: pvpCharacterData.bracket.type, inline: true },
    //   { name: 'W/L (Seasonal)', value: winLosePercentage, inline: true },
    //   { name: 'Wins (Seasonal)', value: pvpCharacterData.season_match_statistics.won.toString(), inline: true },
    //   { name: 'Lost (Seasonal)', value: pvpCharacterData.season_match_statistics.lost.toString(), inline: true },
    //   { name: 'Total (Seasonal)', value: pvpCharacterData.season_match_statistics.played.toString(), inline: true },
    //   { name: 'Wins (Weekly)', value: pvpCharacterData.weekly_match_statistics.won.toString(), inline: true },
    //   { name: 'Lost (Weekly)', value: pvpCharacterData.weekly_match_statistics.lost.toString(), inline: true },
    //   { name: 'Total (Weekly)', value: pvpCharacterData.weekly_match_statistics.played.toString(), inline: true },
    // ] : [
    //   { name: "Season Not Started", value: 'No Matches have been played yet.' }
    // ];

    const bracketData = characterPvPSummary?.brackets?.map(index => {
      return this._wowClientAPI.getHrefData<IPvPBracketResponse>(index.href);
    });

    // Get data for 2v2s before I can proceed (need to know what the bracketData looks like for it)
    const brackets = bracketData?.map(data => {
      return { name: '', value: '', inline: true }
    });

    return new MessageEmbed()
      .setColor(characterData?.faction.type === 'HORDE' ? FACTION_COLOR.HORDE : FACTION_COLOR.ALLIANCE)
      .setTitle(`${username}'s Stats`)
      .setURL(`https://worldofwarcraft.com/en-gb/character/eu/${realm}/${username}`)
      .setThumbnail(characterMediaData?.assets.find(asset => asset.key === 'avatar')?.value ?? WarcraftFallback.URL)
      .addFields([
        { name: 'Username', value: username },
        { name: 'Level', value: characterData?.level.toString() ?? ErrorCodes.NOT_FOUND },
        { name: 'Item Level', value: characterData?.average_item_level.toString() ?? ErrorCodes.NOT_FOUND },
        { name: 'PvP Item Level', value: "123" }
      ])
      // .addFields([
      //   ...seasonal,
      // ])
      .addField('Faction', characterData?.faction.name ?? ErrorCodes.NOT_FOUND);
  }
}