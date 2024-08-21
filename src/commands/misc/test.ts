import { Client, CommandInteraction, Embed, EmbedBuilder, Interaction, PermissionsBitField, SlashCommandBuilder, RestOrArray, APIEmbedField, GuildMember, APIInteractionGuildMember, APIInteractionDataResolvedGuildMember, Guild, TextChannel, TextBasedChannel } from "discord.js";
import axios, { AxiosResponse } from "axios";
import { cmdData, localization } from "../../util/types";
import { getFullDictOf, getMessage, parseMessage } from "../../util/langtools";
import { errorBuilder } from "../../util/embtools";
import { Pool } from "mysql2/typings/mysql/lib/Pool";
// import { getGuildViaID, guildData } from "../../util/mysqltools";


const command: cmdData = {
    addInfo: true,
    permissions: [
        PermissionsBitField.Flags.ManageMessages
    ],
    botPermissions: [
        PermissionsBitField.Flags.ManageMessages
    ],
    data: new SlashCommandBuilder(),
    callback: async (client: Client, interaction: CommandInteraction, loc: localization, connection: Pool) => {
        await interaction.deferReply();
        
        const guildID = interaction.guildId;
        if(guildID === null) return;

        // const guildTest: guildData = await getGuildViaID(connection, guildID);

        // guildTest.logChannelID = "1212121";
        // await guildTest.save();

        await interaction.editReply("s")
    }
}

module.exports = command;