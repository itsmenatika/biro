"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command = {
    addInfo: true,
    permissions: [
        discord_js_1.PermissionsBitField.Flags.ManageMessages
    ],
    botPermissions: [
        discord_js_1.PermissionsBitField.Flags.ManageMessages
    ],
    data: new discord_js_1.SlashCommandBuilder(),
    callback: async (client, interaction, loc, connection) => {
        await interaction.deferReply();
        const guildID = interaction.guildId;
        if (guildID === null)
            return;
        await interaction.editReply("s");
    }
};
module.exports = command;
