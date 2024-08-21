import {  Client, Interaction} from "discord.js";
import { localization } from "../../util/types";
import { Pool } from "mysql2/typings/mysql/lib/Pool";
import { ensureThatGuildDoExistInDatabase } from "../../util/mysqltools";



module.exports = async (client: Client, interaction: Interaction, loc: localization, con: Pool) => {
    if(interaction.guildId == null) return;
    await ensureThatGuildDoExistInDatabase(con, interaction.guildId);
}