"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysqltools_1 = require("../../util/mysqltools");
module.exports = async (client, interaction, loc, con) => {
    console.log(con);
    if (interaction.guildId == null)
        return;
    if (interaction.author.bot)
        return;
    const toAdd = Math.random() * 50 + 1;
    await (0, mysqltools_1.ensureThatUserInGuildDoExistInDatabase)(con, interaction.author.id, interaction.guildId);
    const oldData = await (0, mysqltools_1.getUserInfoInGuild)(con, interaction.author.id, interaction.guildId);
    await (0, mysqltools_1.addUserXP)(con, interaction.author.id, interaction.guildId, toAdd);
    const newData = await (0, mysqltools_1.getUserInfoInGuild)(con, interaction.author.id, interaction.guildId);
    if (newData === undefined || oldData === undefined)
        return;
    if (newData['level'] != oldData['level']) {
        let level = String(newData['level']);
        interaction.channel.send(`gg <@${interaction.author.id}>, new level ${level}`);
    }
};
