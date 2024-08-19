"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const types_1 = require("../../util/types");
const langtools_1 = require("../../util/langtools");
const command = {
    addInfo: true,
    permissions: [
        discord_js_1.PermissionsBitField.Flags.ManageMessages
    ],
    botPermissions: [
        discord_js_1.PermissionsBitField.Flags.ManageMessages
    ],
    data: new discord_js_1.SlashCommandBuilder().addNumberOption(option => option.setName("howmany")
        .setDescription((0, langtools_1.getMessage)("cmd_clear_option_howMany_desc", types_1.localization.en))
        .setNameLocalizations((0, langtools_1.getFullDictOf)("cmd_clear_option_howMany_name"))
        .setDescriptionLocalizations((0, langtools_1.getFullDictOf)("cmd_clear_option_howMany_desc"))
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(1000)),
    callback: async (client, interaction, loc) => {
        await interaction.reply((0, langtools_1.getMessage)("wait...", loc));
        const howMany = Number(interaction.options.get("howmany")?.value);
        if (howMany > 1000)
            return;
        const channel = interaction.channel;
        if (channel === null)
            return;
        if (!(channel instanceof discord_js_1.TextChannel))
            return;
        let currentNumber = howMany + 1;
        while (currentNumber > 0) {
            await channel.bulkDelete(Math.min(currentNumber, 100));
            currentNumber -= 100;
        }
        let emb = new discord_js_1.EmbedBuilder().setFooter({
            text: (0, langtools_1.parseMessage)("cmd_executed_by", loc, { user: interaction.user.displayName }),
            iconURL: String(interaction.user.avatarURL())
        }).setTimestamp()
            .setColor("DarkVividPink")
            .setTitle((0, langtools_1.getMessage)("cmd_clear_result_title", loc));
        await channel.send({
            embeds: [
                emb
            ]
        });
    }
};
module.exports = command;
