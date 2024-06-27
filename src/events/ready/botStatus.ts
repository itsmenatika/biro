import { ActivityType, Client, Interaction } from "discord.js";

module.exports = async (client: Client, interaction: Interaction) => {
    await client.user?.setActivity({
        type: ActivityType.Watching,
        name: "you all :3"
    });
}