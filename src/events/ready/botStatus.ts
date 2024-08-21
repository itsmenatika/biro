import { ActivityType, Client, Interaction } from "discord.js";
import { Pool } from "mysql2/typings/mysql/lib/Pool";

module.exports = async (client: Client, interaction: Interaction, con: Pool) => {
    await client.user?.setActivity({
        type: ActivityType.Watching,
        name: "you all :3"
    });
}