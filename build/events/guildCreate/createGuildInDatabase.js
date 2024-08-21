"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysqltools_1 = require("../../util/mysqltools");
module.exports = async (client, interaction, loc, con) => {
    if (interaction.guildId == null)
        return;
    await (0, mysqltools_1.ensureThatGuildDoExistInDatabase)(con, interaction.guildId);
};
