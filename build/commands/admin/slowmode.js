"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const types_1 = require("../../util/types");
const langtools_1 = require("../../util/langtools");
const embtools_1 = require("../../util/embtools");
const command = {
    addInfo: true,
    botPermissions: [
        discord_js_1.PermissionsBitField.Flags.ManageChannels
    ],
    data: new discord_js_1.SlashCommandBuilder().addNumberOption(option => option.setName("duration")
        .setDescription((0, langtools_1.getMessage)("cmd_slowmode_option_duration_desc", types_1.localization.en))
        .setNameLocalizations((0, langtools_1.getFullDictOf)("cmd_slowmode_option_duration_name"))
        .setDescriptionLocalizations((0, langtools_1.getFullDictOf)("cmd_slowmode_option_duration_name"))
        .setRequired(true)
        .setMinValue(0)).addStringOption(option => option.setName("reason")
        .setDescription((0, langtools_1.getMessage)("reason_desc", types_1.localization.en))
        .setNameLocalizations((0, langtools_1.getFullDictOf)("reason"))
        .setDescriptionLocalizations((0, langtools_1.getFullDictOf)("reason_desc"))),
    callback: async (client, interaction, loc, Connection) => {
        await interaction.deferReply();
        const duration = Number(interaction.options.get("duration")?.value);
        const reason = interaction.options.get("reason")?.value;
        const channel = interaction.channel;
        const user = interaction.member;
        if (channel?.isDMBased()) {
            await interaction.editReply({ embeds: [(0, embtools_1.errorBuilder)("wrongChannelType", interaction, loc, { channelType: (0, langtools_1.getMessage)("dmBasedChannel", loc) })] });
            return;
        }
        if (channel?.isThread()) {
            await interaction.editReply({ embeds: [(0, embtools_1.errorBuilder)("wrongChannelType", interaction, loc, { channelType: (0, langtools_1.getMessage)("threadBasedChannel", loc) })] });
            return;
        }
        if (typeof (user) == null) {
            await interaction.editReply({ embeds: [(0, embtools_1.errorBuilder)("noUser", interaction, loc, {})] });
            return;
        }
        if (typeof (user?.permissions) == "string") {
            await interaction.editReply({ embeds: [(0, embtools_1.errorBuilder)("unkown", interaction, loc, {})] });
            return;
        }
        if (!user?.permissions.has(discord_js_1.PermissionsBitField.Flags.ManageChannels)) {
            if (!interaction.channel.permissionsFor(interaction.member).has(discord_js_1.PermissionsBitField.Flags.ManageChannels)) {
                await interaction.editReply({ embeds: [(0, embtools_1.errorBuilder)("userPermissions", interaction, loc, { permName: (0, langtools_1.getMessage)("perm_manageChannels", loc), userDisplayName: interaction.user.displayName })] });
                return;
            }
        }
        let emb = new discord_js_1.EmbedBuilder().setFooter({
            text: (0, langtools_1.parseMessage)("cmd_executed_by", loc, { user: interaction.user.displayName }),
            iconURL: String(interaction.user.avatarURL())
        }).setColor("Green")
            .setTitle((0, langtools_1.getMessage)("success_with_coma", loc));
        if (typeof (reason) == "undefined") {
            emb = emb.setDescription((0, langtools_1.parseMessage)("success_slowmode", loc, { channel: `<#${interaction.channel?.id}>`, newCooldown: `${duration}s`, reason: "THERE WAS NO REASON :C" }));
            await channel.setRateLimitPerUser(duration);
        }
        else {
            emb = emb.setDescription((0, langtools_1.parseMessage)("success_slowmode_with_reason", loc, { channel: `<#${interaction.channel?.id}>`, newCooldown: `${duration}s`, reason: String(reason) }));
            await channel.setRateLimitPerUser(duration, String(reason));
        }
        await interaction.editReply({ embeds: [emb] });
    }
};
module.exports = command;
