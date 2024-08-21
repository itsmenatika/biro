import { ActivityType, Client, Interaction, Message } from "discord.js";
import { Pool } from "mysql2/typings/mysql/lib/Pool";
import { addUserXP, ensureThatUserInGuildDoExistInDatabase, getUserInfoInGuild } from "../../util/mysqltools";
import { localization } from "../../util/types";

module.exports = async (client: Client, interaction: Message, loc: localization, con: Pool) => {
    console.log(con);
    if(interaction.guildId == null) return;
    if(interaction.author.bot) return;

    const toAdd = Math.random()*50+1

    await ensureThatUserInGuildDoExistInDatabase(con, interaction.author.id, interaction.guildId);

    const oldData = await getUserInfoInGuild(con, interaction.author.id, interaction.guildId);

    await addUserXP(con, interaction.author.id, interaction.guildId, toAdd);

    const newData = await getUserInfoInGuild(con, interaction.author.id, interaction.guildId);
    
    if(newData === undefined || oldData === undefined) return;

    if(newData['level' as keyof typeof newData] != oldData['level' as keyof typeof oldData]){
        let level: string = String(newData['level' as keyof typeof newData]);
        interaction.channel.send(`gg <@${interaction.author.id}>, new level ${level}`)
    }
}