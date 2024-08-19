"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const types_1 = require("../../util/types");
const langtools_1 = require("../../util/langtools");
const embtools_1 = require("../../util/embtools");
const command = {
    addInfo: true,
    permissions: [],
    data: new discord_js_1.SlashCommandBuilder().addUserOption(option => option.setName("user")
        .setDescription((0, langtools_1.getMessage)("cmd_user_option_user_desc", types_1.localization.en))
        .setNameLocalizations((0, langtools_1.getFullDictOf)("cmd_user_option_user_name"))
        .setDescriptionLocalizations((0, langtools_1.getFullDictOf)("cmd_user_option_user_desc"))),
    callback: async (client, interaction, loc) => {
        await interaction.deferReply();
        let mentionedUser = interaction.options.get("user")?.member;
        if (mentionedUser == undefined) {
            mentionedUser = interaction.member;
        }
        if (mentionedUser === null) {
            await interaction.editReply({ embeds: [(0, embtools_1.errorBuilder)("mentionedUserIsNotOnServer", interaction, loc, { "mentionedUser": String(interaction.options.get("user")?.value) })] });
            return;
        }
        if (!(mentionedUser instanceof discord_js_1.GuildMember)) {
            await interaction.editReply({ embeds: [(0, embtools_1.errorBuilder)("unkown", interaction, loc, { addInfo: "user should be here instance of guildMember is not!" })] });
            return;
        }
        let emb = new discord_js_1.EmbedBuilder().setFooter({
            text: (0, langtools_1.parseMessage)("cmd_executed_by", loc, { user: interaction.user.displayName }),
            iconURL: String(interaction.user.avatarURL())
        }).setTimestamp()
            .setColor("Aqua").setDescription(`<@${mentionedUser.id}>`)
            .setTitle((0, langtools_1.parseMessage)("cmd_user_result_title", loc, { userName: mentionedUser.displayName })).setTimestamp();
        let roles = [];
        mentionedUser.roles.cache.forEach(element => {
            if (!(element.name == "@everyone"))
                roles.push(`<@&${element.id}>`);
        });
        console.log(roles);
        emb.addFields([
            {
                name: (0, langtools_1.getMessage)('id', loc),
                value: mentionedUser.id,
                inline: true
            },
            {
                name: (0, langtools_1.getMessage)("cmd_user_result_joinServerDate", loc),
                value: `<t:${Math.round(Number(mentionedUser.joinedTimestamp) / 1000)}:F> (<t:${Math.round(Number(mentionedUser.joinedTimestamp) / 1000)}:R>)`,
                inline: true
            },
            {
                name: (0, langtools_1.getMessage)("cmd_user_result_joinDiscordDate", loc),
                value: `<t:${Math.round(mentionedUser.user.createdTimestamp / 1000)}:F> (<t:${Math.round(mentionedUser.user.createdTimestamp / 1000)}:R>)`,
                inline: true
            },
            {
                name: (0, langtools_1.getMessage)("cmd_user_result_roles", loc),
                value: roles.length > 0 ? String(roles.reduce((prev, next) => prev + ", " + next)) : (0, langtools_1.getMessage)("cmd_user_result_noRoles", loc),
                inline: true
            },
            {
                name: (0, langtools_1.getMessage)("cmd_user_result_premium", loc),
                value: mentionedUser.premiumSince ? `<t:${Math.round(Number(mentionedUser.premiumSinceTimestamp) / 1000)}:F> (<t:${Math.round(Number(mentionedUser.premiumSince) / 1000)}:R>)` : (0, langtools_1.getMessage)("cmd_user_result_nonPremium", loc),
                inline: true
            },
            {
                name: (0, langtools_1.getMessage)("cmd_user_result_avatarLink", loc),
                value: `[link](${mentionedUser.displayAvatarURL()})`,
                inline: true
            },
        ]);
        emb.setThumbnail(String(mentionedUser.displayAvatarURL()));
        await interaction.editReply({ embeds: [emb] });
        return;
    }
};
module.exports = command;
