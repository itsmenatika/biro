import { Client, CommandInteraction, Embed, EmbedBuilder, Interaction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { cmdData, localization } from "../../util/types";
import { getMessage } from "../../util/langtools";


const command: cmdData = {
    addInfo: true,
    permissions: [
        PermissionsBitField.Flags.AddReactions
    ],
    data: new SlashCommandBuilder(),
    callback: async (client: Client, interaction: CommandInteraction, loc: localization) => {
        await interaction.deferReply();
        console.log(loc);
        const emb: EmbedBuilder = new EmbedBuilder().setTitle(getMessage("cmd_help_title", loc))
        .setTimestamp();

        await interaction.editReply({embeds: [emb]});
        return;
    }
}

module.exports = command;