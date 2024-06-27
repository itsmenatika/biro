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
        console.log(loc);
        const emb = new discord_js_1.EmbedBuilder().setTitle((0, langtools_1.getMessage)("cmd_help_title", loc))
            .setTimestamp();
        await interaction.editReply({ embeds: [emb] });
        return;
    }
};
module.exports = command;
//# sourceMappingURL=help.js.map