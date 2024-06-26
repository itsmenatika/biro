"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command = {
    data: new discord_js_1.SlashCommandBuilder().setName("help")
        .setDescription("test"),
    callback: async (client, interaction) => {
        interaction.reply("test");
        return;
    }
};
module.exports = command;
//# sourceMappingURL=help.js.map