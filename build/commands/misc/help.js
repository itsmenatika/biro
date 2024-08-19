"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const langtools_1 = require("../../util/langtools");
const command = {
    addInfo: true,
    permissions: [
        discord_js_1.PermissionsBitField.Flags.AddReactions
    ],
    data: new discord_js_1.SlashCommandBuilder(),
    callback: async (client, interaction, loc) => {
        await interaction.deferReply();
        let user = interaction.user;
        const emb = new discord_js_1.EmbedBuilder().setTitle((0, langtools_1.getMessage)("cmd_help_title", loc))
            .setFooter({
            text: (0, langtools_1.parseMessage)("cmd_executed_by", loc, { user: user.displayName }),
            iconURL: String(user.avatarURL())
        })
            .setDescription((0, langtools_1.getMessage)("cmd_help_info", loc));
        let categoryTempData = [];
        global.commandCategoryData.forEach((commandList, categoryName) => {
            let temp = '';
            commandList.forEach(element => temp += (0, langtools_1.getMessage)(`cmd_${element}_name`, loc) + ", ");
            categoryTempData.push({
                name: (0, langtools_1.getMessage)(`cat_${categoryName}_name`, loc),
                value: temp.slice(0, -2),
                inline: true
            });
        });
        emb.addFields(categoryTempData);
        await interaction.editReply({ embeds: [emb] });
        return;
    }
};
module.exports = command;
