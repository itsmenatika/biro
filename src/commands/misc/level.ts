import { Client, CommandInteraction, Embed, EmbedBuilder, Interaction, PermissionsBitField, SlashCommandBuilder, RestOrArray, APIEmbedField, GuildMember, APIInteractionGuildMember, APIInteractionDataResolvedGuildMember, Guild, TextChannel, TextBasedChannel, AttachmentBuilder } from "discord.js";
import axios, { AxiosResponse } from "axios";
import { cmdData, localization } from "../../util/types";
import { getFullDictOf, getMessage, parseMessage } from "../../util/langtools";
import { errorBuilder } from "../../util/embtools";
import { Pool } from "mysql2/typings/mysql/lib/Pool";
import { ensureThatUserInGuildDoExistInDatabase, getUserInfoInGuild } from "../../util/mysqltools";
import { createCanvas } from "canvas";
import { RankCardBuilder } from "canvacord";
// import { getGuildViaID, guildData } from "../../util/mysqltools";

// @ts-nocheck
const command: cmdData = {
    addInfo: true,
    data: new SlashCommandBuilder(),
    callback: async (client: Client, interaction: CommandInteraction, loc: localization, connection: Pool) => {
        await interaction.deferReply();
        if(!(interaction.guild)){
            await interaction.editReply({
                embeds: [
                    errorBuilder("notOnGuild", interaction, loc, {})
                ]
            });
            return;          
        }
        
        const user = interaction.user;

        await ensureThatUserInGuildDoExistInDatabase(connection, interaction.user.id, interaction.guild?.id);

        const userData = await getUserInfoInGuild(connection, interaction.user.id, interaction.guild.id);
        
        if(userData===undefined){
            await interaction.editReply({
                embeds: [
                    errorBuilder("database", interaction, loc, {})
                ]
            });
            return;  
        }

        const level: number = Number(userData['level' as keyof typeof userData]);
        const xpToNextLevel: number = Number(userData['xpToNextLevel' as keyof typeof userData]);
        const xpNow: number = Number(userData['xpNow' as keyof typeof userData]);
        
        const canvacord = new RankCardBuilder()
        .setUsername(user.displayName)
        .setAvatar(user.displayAvatarURL({size: 256}))
        .setCurrentXP(xpNow)
        .setRequiredXP(xpToNextLevel)
        .setLevel(level);

        const convaImage = await canvacord.build();
        const imageAttachment = new AttachmentBuilder(convaImage);
        
        await interaction.editReply({files: [imageAttachment]});
    }
}

module.exports = command;