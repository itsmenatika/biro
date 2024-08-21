"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const langtools_1 = require("../../util/langtools");
const embtools_1 = require("../../util/embtools");
const command = {
    addInfo: true,
    permissions: [],
    data: new discord_js_1.SlashCommandBuilder(),
    callback: async (client, interaction, loc, Connection) => {
        await interaction.deferReply();
        const guild = interaction.guild;
        if (guild == null) {
            await interaction.editReply({
                embeds: [
                    (0, embtools_1.errorBuilder)("notOnGuild", interaction, loc, {})
                ]
            });
            return;
        }
        let maxEmojis = 50;
        switch (guild?.premiumTier) {
            case 3:
                maxEmojis += 100;
            case 2:
                maxEmojis += 50;
            case 1:
                maxEmojis += 50;
        }
        console.log(maxEmojis);
        let emb = new discord_js_1.EmbedBuilder().setFooter({
            text: (0, langtools_1.parseMessage)("cmd_executed_by", loc, { user: interaction.user.displayName }),
            iconURL: String(interaction.user.avatarURL())
        }).setColor("DarkAqua")
            .setTitle((0, langtools_1.parseMessage)("cmd_server_result_title", loc, { serverDisplayName: guild.name }))
            .setFields([
            {
                name: (0, langtools_1.getMessage)('id', loc),
                value: String(guild?.id),
                inline: true
            },
            {
                name: (0, langtools_1.getMessage)('cmd_server_result_createdAt', loc),
                value: `<t:${Math.round(guild.createdTimestamp / 1000)}:F> (<t:${Math.round(guild.createdTimestamp / 1000)}:R>)`,
                inline: true
            },
            {
                name: (0, langtools_1.getMessage)('cmd_server_result_memberCount', loc),
                value: String(guild?.memberCount),
                inline: true
            },
            {
                name: (0, langtools_1.getMessage)('cmd_server_result_rolesCount', loc),
                value: String(guild?.roles.cache.size),
                inline: true
            },
            {
                name: (0, langtools_1.getMessage)('cmd_server_result_emotesCount_title', loc),
                value: (0, langtools_1.parseMessage)("cmd_server_result_emotesCount_desc", loc, {
                    now: String(guild?.emojis.cache.size),
                    max: String(maxEmojis)
                }),
                inline: true
            },
            {
                name: (0, langtools_1.getMessage)('cmd_server_result_owner', loc),
                value: `<@${guild?.ownerId}>`,
                inline: true
            },
        ]);
        await interaction.editReply({ embeds: [emb] });
    }
};
module.exports = command;
