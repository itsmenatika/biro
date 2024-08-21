"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = async (client, interaction, con) => {
    await client.user?.setActivity({
        type: discord_js_1.ActivityType.Watching,
        name: "you all :3"
    });
};
