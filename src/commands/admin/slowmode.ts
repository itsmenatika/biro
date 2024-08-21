import { SlashCommandBuilder, Client, CommandInteraction, PermissionsBitField, EmbedBuilder } from "discord.js";

import { cmdData, localization } from "../../util/types";
import { getFullDictOf, getMessage, parseMessage } from "../../util/langtools";
import { errorBuilder } from "../../util/embtools";
import { Pool } from "mysql2/typings/mysql/lib/Pool";


const command: cmdData = {
    addInfo: true,
    botPermissions: [
        PermissionsBitField.Flags.ManageChannels
    ],
    data: new SlashCommandBuilder().addNumberOption(
        option => option.setName("duration")
        .setDescription(getMessage("cmd_slowmode_option_duration_desc", localization.en))
        .setNameLocalizations(getFullDictOf("cmd_slowmode_option_duration_name"))
        .setDescriptionLocalizations(getFullDictOf("cmd_slowmode_option_duration_name"))
        .setRequired(true)
        .setMinValue(0)
    ).addStringOption(option => 
        option.setName("reason")
        .setDescription(getMessage("reason_desc", localization.en))
        .setNameLocalizations(getFullDictOf("reason"))
        .setDescriptionLocalizations(getFullDictOf("reason_desc"))
    ),
    callback: async (client: Client, interaction: CommandInteraction, loc: localization, Connection: Pool) => {
        await interaction.deferReply();

        const duration: Number = Number(interaction.options.get("duration")?.value);
        const reason: string | undefined | Number | boolean = interaction.options.get("reason")?.value;

        const channel = interaction.channel;
        const user = interaction.member;

        // check for type of a channel
        if(channel?.isDMBased()){
            await interaction.editReply({embeds: 
                [errorBuilder("wrongChannelType", interaction, loc, {channelType: getMessage("dmBasedChannel",loc)})]});
            return;
        }

        if(channel?.isThread()){
            await interaction.editReply({embeds: 
                [errorBuilder("wrongChannelType", interaction, loc, {channelType: getMessage("threadBasedChannel",loc)})]});
            return;
        }

        // if no user
        if(typeof(user) == null){
            await interaction.editReply({embeds: [errorBuilder("noUser", interaction, loc, {})]});
            return;
        }

        // checking for permissions
        if(typeof(user?.permissions) == "string"){
            await interaction.editReply({embeds: [errorBuilder("unkown", interaction, loc, {})]});
            return;
        }
        
        if(!user?.permissions.has(PermissionsBitField.Flags.ManageChannels)){
            // @ts-ignore
            if(!interaction.channel.permissionsFor(interaction.member).has(PermissionsBitField.Flags.ManageChannels)){
                await interaction.editReply({embeds: [errorBuilder("userPermissions", interaction, loc, {permName: getMessage("perm_manageChannels",loc), userDisplayName: interaction.user.displayName})]});
                return;               
            }
        }


        // creating embed
        let emb: EmbedBuilder = new EmbedBuilder().setFooter({
            text: parseMessage("cmd_executed_by", loc, {user: interaction.user.displayName}),
            iconURL: String(interaction.user.avatarURL())
        }).setColor("Green")
        .setTitle(getMessage("success_with_coma", loc));

        // performing action
        if(typeof(reason) == "undefined"){
            emb = emb.setDescription(parseMessage("success_slowmode", loc, {channel: `<#${interaction.channel?.id}>`, newCooldown: `${duration}s`, reason: "THERE WAS NO REASON :C"}));
            // @ts-ignore
            await channel.setRateLimitPerUser(duration);
        }
        else{
            emb = emb.setDescription(parseMessage("success_slowmode_with_reason", loc, {channel: `<#${interaction.channel?.id}>`, newCooldown: `${duration}s`, reason: String(reason)}));
            // @ts-ignore
            await channel.setRateLimitPerUser(duration, String(reason)); 
        }
        // await channel.setRateLimitPerUser(duration);



        await interaction.editReply({embeds: [emb]})

        // interaction.editReply()
    }
}


module.exports = command