import { Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder,  Guild } from "discord.js";
import { cmdData, localization } from "../../util/types";
import { getMessage, parseMessage } from "../../util/langtools";
import { errorBuilder } from "../../util/embtools";


const command: cmdData = {
    addInfo: true,
    permissions: [
    ],
    data: new SlashCommandBuilder(),
    callback: async (client: Client, interaction: CommandInteraction, loc: localization) => {
        // await interaction to give more time for a bot
        await interaction.deferReply();

        const guild: Guild | null = interaction.guild;
        
        if(guild == null){
            await interaction.editReply({
                embeds: [
                    errorBuilder("notOnGuild", interaction, loc, {})
                ]
            });
            return;
        }

        let maxEmojis = 50;
        switch(guild?.premiumTier){
            case 3:
            maxEmojis += 100;
            case 2:
            maxEmojis += 50;
            case 1:
            maxEmojis += 50;
        }

        console.log(maxEmojis);

        let emb: EmbedBuilder = new EmbedBuilder().setFooter({
            text: parseMessage("cmd_executed_by", loc, {user: interaction.user.displayName}),
            iconURL: String(interaction.user.avatarURL())
        }).setColor("DarkAqua")
        .setTitle(parseMessage("cmd_server_result_title", loc, {serverDisplayName: guild.name}))
        .setFields([
            {
                name: getMessage('id', loc),
                value: String(guild?.id),
                inline: true
            }, 
            {
                name: getMessage('cmd_server_result_createdAt', loc),
                value: `<t:${Math.round(guild.createdTimestamp / 1000)}:F> (<t:${Math.round(guild.createdTimestamp / 1000)}:R>)`,
                inline: true
            },               
            {
                name: getMessage('cmd_server_result_memberCount', loc),
                value: String(guild?.memberCount),
                inline: true
            },
            {
                name: getMessage('cmd_server_result_rolesCount', loc),
                value: String(guild?.roles.cache.size),
                inline: true
            },
            {
                name: getMessage('cmd_server_result_emotesCount_title', loc),
                value: parseMessage("cmd_server_result_emotesCount_desc", loc, {
                    now: String(guild?.emojis.cache.size),
                    max: String(maxEmojis)
                }),
                inline: true
            },
            {
                name: getMessage('cmd_server_result_owner', loc),
                value: `<@${guild?.ownerId}>`,
                inline: true
            },            
        ]);

        await interaction.editReply({embeds: [emb]});
    }
}

module.exports = command;