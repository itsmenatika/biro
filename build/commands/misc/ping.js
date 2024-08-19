"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const langtools_1 = require("../../util/langtools");
const command = {
    addInfo: true,
    data: new discord_js_1.SlashCommandBuilder(),
    callback: async (client, interaction, loc) => {
        await interaction.deferReply();
        const reply = await interaction.fetchReply();
        const time = reply.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply((0, langtools_1.parseMessage)("cmd_ping_result", loc, { time: String(Math.round(time / 2)) }));
    }
};
module.exports = command;
