"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command = {
    addInfo: true,
    permissions: [
        discord_js_1.PermissionsBitField.Flags.AddReactions
    ],
    data: new discord_js_1.SlashCommandBuilder(),
    callback: async (client, interaction) => {
        await interaction.deferReply();
        const emb = new discord_js_1.EmbedBuilder().setTitle("Pomoc")
            .setTimestamp();
        await interaction.editReply({ embeds: [emb] });
        return;
    }
};
module.exports = command;
//# sourceMappingURL=help.js.map