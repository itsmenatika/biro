import { Client, CommandInteraction, Interaction, SlashCommandBuilder } from "discord.js";
import { cmdData } from "../../util/types";


const command: cmdData = {
    data: new SlashCommandBuilder().setName("help")
    .setDescription("test"),
    callback: async (client: Client, interaction: CommandInteraction) => {
        interaction.reply("test");
        return;
    }
}

module.exports = command;