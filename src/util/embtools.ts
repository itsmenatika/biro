import { CommandInteraction, EmbedBuilder, Interaction } from "discord.js";
import { localization } from "./types";
import { getMessage, parseMessage } from "./langtools";



function errorBuilder(errorName: string, interaction: Interaction|CommandInteraction, loc: localization, addInfo: Record<string, string>): EmbedBuilder{
    return new EmbedBuilder().setTimestamp()
    .setFooter({
        text: parseMessage("cmd_executed_by", loc, {user: interaction.user.displayName}),
        iconURL: String(interaction.user.avatarURL())
    })
    .setColor("DarkRed").setTitle(parseMessage("error_with_title",loc, {errorName: errorName, ...addInfo, errorTitle:
        parseMessage(`error_${errorName}_name`, loc, {errorName: errorName, ...addInfo})
        }))
    .setDescription(parseMessage(`error_${errorName}_desc`, loc, {errorName: errorName, ...addInfo}))
}


export {errorBuilder}