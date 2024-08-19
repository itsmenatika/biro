"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const langtools_1 = require("../../util/langtools");
module.exports = async (client, interaction, loc) => {
    const firstChannel = interaction.guild?.channels.cache.find((channel) => channel.type === discord_js_1.ChannelType.GuildText);
    if (firstChannel === undefined || !(firstChannel instanceof discord_js_1.TextChannel))
        return;
    let emb = new discord_js_1.EmbedBuilder().setTimestamp()
        .setTitle((0, langtools_1.getMessage)("newguild_title", loc))
        .setDescription((0, langtools_1.getMessage)("newguild_desc", loc))
        .setColor("Fuchsia");
    await firstChannel?.send({ embeds: [
            emb
        ] });
};
