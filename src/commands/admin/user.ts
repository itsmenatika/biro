import { Client, CommandInteraction, Embed, EmbedBuilder, Interaction, PermissionsBitField, SlashCommandBuilder, RestOrArray, APIEmbedField, GuildMember, APIInteractionGuildMember, APIInteractionDataResolvedGuildMember } from "discord.js";
import axios, { AxiosResponse } from "axios";
import { cmdData, localization } from "../../util/types";
import { getFullDictOf, getMessage, parseMessage } from "../../util/langtools";
import { errorBuilder } from "../../util/embtools";


const command: cmdData = {
    addInfo: true,
    permissions: [
    ],
    data: new SlashCommandBuilder().addUserOption(option => 
        option.setName("user")
        .setDescription(getMessage("cmd_user_option_user_desc", localization.en))
        .setNameLocalizations(getFullDictOf("cmd_user_option_user_name"))
        .setDescriptionLocalizations(getFullDictOf("cmd_user_option_user_desc"))
        // .setRequired(true)
    ),
    callback: async (client: Client, interaction: CommandInteraction, loc: localization) => {
        // await interaction to give more time for a bot
        await interaction.deferReply();



        // get options
        let mentionedUser: GuildMember | APIInteractionDataResolvedGuildMember | null | undefined = interaction.options.get("user")?.member;

        // if user was not chosen, then set mentionedUser to interaction user
        if(mentionedUser==undefined){
            mentionedUser = interaction.member;
        }

        // if user is not even here or is incorrect
        if(mentionedUser === null){
            await interaction.editReply({embeds: [errorBuilder("mentionedUserIsNotOnServer", interaction, loc, {"mentionedUser": String(interaction.options.get("user")?.value)})]});
            return;           
        }

        // for safety and typescript purposes
        if(!(mentionedUser instanceof GuildMember)){
            await interaction.editReply({embeds: [errorBuilder("unkown", interaction, loc, {addInfo: "user should be here instance of guildMember is not!"})]});
            return;
        }

        // create emb
        let emb: EmbedBuilder = new EmbedBuilder().setFooter({
            text: parseMessage("cmd_executed_by", loc, {user: interaction.user.displayName}),
            iconURL: String(interaction.user.avatarURL())
        }).setTimestamp()
        .setColor("Aqua").setDescription(`<@${mentionedUser.id}>`)
        .setTitle(parseMessage("cmd_user_result_title", loc, {userName: mentionedUser.displayName})).setTimestamp();

        let roles: string[] = [];
        mentionedUser.roles.cache.forEach(element => {
            if(!(element.name == "@everyone"))
            roles.push(`<@&${element.id}>`);
            // roles.push(String(interaction.guild?.roles.cache.find((roleL) => roleL.id === element.id)?.name))
        });

        console.log(roles);

        emb.addFields([
            {
                name: getMessage('id', loc),
                value: mentionedUser.id,
                inline: true
            },
            {
                name: getMessage("cmd_user_result_joinServerDate", loc),
                value: `<t:${Math.round(Number(mentionedUser.joinedTimestamp) / 1000)}:F> (<t:${Math.round(Number(mentionedUser.joinedTimestamp) / 1000)}:R>)`,
                inline: true
            },
            {
                name: getMessage("cmd_user_result_joinDiscordDate", loc),
                value: `<t:${Math.round(mentionedUser.user.createdTimestamp / 1000)}:F> (<t:${Math.round(mentionedUser.user.createdTimestamp / 1000)}:R>)`,
                inline: true
            },     
            {
                name: getMessage("cmd_user_result_roles", loc),
                value: roles.length > 0 ? String(roles.reduce((prev,next) => prev + ", " + next)) : getMessage("cmd_user_result_noRoles", loc),
                inline: true
            },    
            {
                name: getMessage("cmd_user_result_premium", loc),
                value: mentionedUser.premiumSince ? `<t:${Math.round(Number(mentionedUser.premiumSinceTimestamp) / 1000)}:F> (<t:${Math.round(Number(mentionedUser.premiumSince) / 1000)}:R>)` : getMessage("cmd_user_result_nonPremium", loc),
                inline: true
            },
            {
                name: getMessage("cmd_user_result_avatarLink", loc),
                value: `[link](${mentionedUser.displayAvatarURL()})`,
                inline: true
            },
            // {
            //     name: getMessage("cmd_user_result_badges", loc),
            //     value: "????",
            // }  
        ]);

        emb.setThumbnail(String(mentionedUser.displayAvatarURL()));

       
        await interaction.editReply({embeds: [emb]});
        return;
    }
}

module.exports = command;