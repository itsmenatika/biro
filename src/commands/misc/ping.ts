import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { cmdData, localization } from "../../util/types";
import { parseMessage } from "../../util/langtools";

const command: cmdData = {
    addInfo: true,
    data: new SlashCommandBuilder(),
    callback: async (client: Client, interaction: CommandInteraction, loc: localization) => {
        await interaction.deferReply();
        const reply = await interaction.fetchReply();
        const time = reply.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply(parseMessage("cmd_ping_result", loc, {time: String(Math.round(time / 2))}));
    }
}

module.exports = command;