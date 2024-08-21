"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const axios_1 = __importDefault(require("axios"));
const types_1 = require("../../util/types");
const langtools_1 = require("../../util/langtools");
const embtools_1 = require("../../util/embtools");
const command = {
    addInfo: true,
    permissions: [],
    data: new discord_js_1.SlashCommandBuilder().addUserOption(option => option.setName("user")
        .setDescription((0, langtools_1.getMessage)("cmd_slap_option_user_desc", types_1.localization.en))
        .setNameLocalizations((0, langtools_1.getFullDictOf)("cmd_slap_option_user_name"))
        .setDescriptionLocalizations((0, langtools_1.getFullDictOf)("cmd_slap_option_user_name"))
        .setRequired(true)),
    callback: async (client, interaction, loc, connection) => {
        await interaction.deferReply();
        let mentionedUser = interaction.options.get("user")?.member;
        if (mentionedUser === null || mentionedUser === undefined) {
            await interaction.editReply({ embeds: [(0, embtools_1.errorBuilder)("mentionedUserIsNotOnServer", interaction, loc, { "mentionedUser": String(interaction.options.get("user")?.value) })] });
            return;
        }
        if (!(mentionedUser instanceof discord_js_1.GuildMember)) {
            await interaction.editReply({ embeds: [(0, embtools_1.errorBuilder)("unkown", interaction, loc, { addInfo: "user should be here instance of guildMember is not!" })] });
            return;
        }
        if (interaction.user.id === mentionedUser.id) {
            let emb = new discord_js_1.EmbedBuilder().setTimestamp().setFooter({
                text: (0, langtools_1.parseMessage)("cmd_executed_by", loc, { user: interaction.user.displayName }),
                iconURL: String(interaction.user.avatarURL())
            }).setColor("Blurple").setTitle((0, langtools_1.getMessage)("noooooo", loc))
                .setDescription((0, langtools_1.getMessage)("canttoyourself", loc));
            await interaction.editReply({ embeds: [emb] });
            return;
        }
        let emb = new discord_js_1.EmbedBuilder().setTimestamp().setFooter({
            text: (0, langtools_1.parseMessage)("cmd_executed_by", loc, { user: interaction.user.displayName }),
            iconURL: String(interaction.user.avatarURL())
        }).setColor("Aqua")
            .setTitle((0, langtools_1.getMessage)("cmd_slap_result_slapped_name", loc)).setDescription((0, langtools_1.parseMessage)("cmd_slap_result_slapped_desc", loc, { firstUserID: interaction.user.id, secondUserID: mentionedUser.id }));
        const fromApi = await axios_1.default.get('https://api.otakugifs.xyz/gif?reaction=slap&format=gif');
        if (fromApi.status != 200) {
            await interaction.editReply({ embeds: [(0, embtools_1.errorBuilder)("apiError", interaction, loc, { apiName: "otakugifs" })] });
            return;
        }
        emb.setImage(fromApi.data.url);
        await interaction.editReply({ embeds: [emb] });
        return;
    }
};
module.exports = command;
