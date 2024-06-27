import { Client, CommandInteraction, Embed, EmbedBuilder, Interaction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { cmdData } from "../../util/types";


const command: cmdData = {
    addInfo: true,
    permissions: [
        PermissionsBitField.Flags.AddReactions
    ],
    data: new SlashCommandBuilder(),
    callback: async (client: Client, interaction: CommandInteraction) => {
        await interaction.deferReply();

        const emb: EmbedBuilder = new EmbedBuilder().setTitle("Pomoc")
        .setTimestamp();

        await interaction.editReply({embeds: [emb]});
        return;
    }
}

module.exports = command;