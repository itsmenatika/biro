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
        .setDescription(getMessage("cmd_slap_option_user_desc", localization.en))
        .setNameLocalizations(getFullDictOf("cmd_slap_option_user_name"))
        .setDescriptionLocalizations(getFullDictOf("cmd_slap_option_user_name"))
        .setRequired(true)
    ),
    callback: async (client: Client, interaction: CommandInteraction, loc: localization) => {
        // await interaction to give more time for a bot
        await interaction.deferReply();

        // get options
        let mentionedUser: GuildMember | APIInteractionDataResolvedGuildMember | null | undefined = interaction.options.get("user")?.member;

        // if user is not even here or is incorrect
        if(mentionedUser === null || mentionedUser === undefined){
            await interaction.editReply({embeds: [errorBuilder("mentionedUserIsNotOnServer", interaction, loc, {"mentionedUser": String(interaction.options.get("user")?.value)})]});
            return;           
        }

        // for safety and typescript purposes
        if(!(mentionedUser instanceof GuildMember)){
            await interaction.editReply({embeds: [errorBuilder("unkown", interaction, loc, {addInfo: "user should be here instance of guildMember is not!"})]});
            return;
        }

        // if user is themself
        if(interaction.user.id === mentionedUser.id){
            let emb: EmbedBuilder = new EmbedBuilder().setTimestamp().setFooter({
                text: parseMessage("cmd_executed_by", loc, {user: interaction.user.displayName}),
                iconURL: String(interaction.user.avatarURL())
            }).setColor("Blurple").setTitle(getMessage("noooooo", loc))
            .setDescription(getMessage("canttoyourself", loc));
            await interaction.editReply({embeds: [emb]});
            return;
        }

        // basic emb
        let emb: EmbedBuilder = new EmbedBuilder().setTimestamp().setFooter({
            text: parseMessage("cmd_executed_by", loc, {user: interaction.user.displayName}),
            iconURL: String(interaction.user.avatarURL())
        }).setColor("Aqua")
        .setTitle(getMessage("cmd_slap_result_slapped_name", loc)).setDescription(
                                                            parseMessage("cmd_slap_result_slapped_desc", loc, {firstUserID: interaction.user.id, secondUserID: mentionedUser.id})
                                                            );


        // get image from api (otakugifs)
        const fromApi: AxiosResponse = await axios.get('https://api.otakugifs.xyz/gif?reaction=slap&format=gif');

        // check if response is ok
        if(fromApi.status != 200){
            await interaction.editReply({embeds: [errorBuilder("apiError", interaction, loc, {apiName: "otakugifs"})]});
            return;
        }

        // send image and send back
        emb.setImage(fromApi.data.url);
       
        await interaction.editReply({embeds: [emb]});
        return;
    }
}

module.exports = command;