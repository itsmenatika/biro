"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const embtools_1 = require("../../util/embtools");
const mysqltools_1 = require("../../util/mysqltools");
const canvacord_1 = require("canvacord");
const command = {
    addInfo: true,
    data: new discord_js_1.SlashCommandBuilder(),
    callback: async (client, interaction, loc, connection) => {
        await interaction.deferReply();
        if (!(interaction.guild)) {
            await interaction.editReply({
                embeds: [
                    (0, embtools_1.errorBuilder)("notOnGuild", interaction, loc, {})
                ]
            });
            return;
        }
        const user = interaction.user;
        await (0, mysqltools_1.ensureThatUserInGuildDoExistInDatabase)(connection, interaction.user.id, interaction.guild?.id);
        const userData = await (0, mysqltools_1.getUserInfoInGuild)(connection, interaction.user.id, interaction.guild.id);
        if (userData === undefined) {
            await interaction.editReply({
                embeds: [
                    (0, embtools_1.errorBuilder)("database", interaction, loc, {})
                ]
            });
            return;
        }
        const level = Number(userData['level']);
        const xpToNextLevel = Number(userData['xpToNextLevel']);
        const xpNow = Number(userData['xpNow']);
        const canvacord = new canvacord_1.RankCardBuilder()
            .setUsername(user.displayName)
            .setAvatar(user.displayAvatarURL({ size: 256 }))
            .setCurrentXP(xpNow)
            .setRequiredXP(xpToNextLevel)
            .setLevel(level);
        const convaImage = await canvacord.build();
        const imageAttachment = new discord_js_1.AttachmentBuilder(convaImage);
        await interaction.editReply({ files: [imageAttachment] });
    }
};
module.exports = command;
