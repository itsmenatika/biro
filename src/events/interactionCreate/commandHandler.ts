import { Client, Interaction } from "discord.js";

module.exports = async (client: Client, interaction: Interaction) => {
    // console.log(interaction);
    if(!interaction.isCommand()) return;

    const cmd = global.commandData.get(interaction.commandName);

    await cmd?.callback(client,interaction);
}