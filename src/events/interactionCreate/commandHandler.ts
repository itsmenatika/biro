import { Client, Interaction, PermissionsBitField } from "discord.js";



module.exports = async (client: Client, interaction: Interaction) => {
    // console.log(interaction);
    if(!interaction.isCommand()) return;

    const cmd = global.commandData.get(interaction.commandName);

    if(!cmd){
        await interaction.reply("interaction error, that command doesnt exist!");
        return;
    }


    if(cmd.permissions){
        // permissions for user
        var notEnoughPermission: bigint | undefined = undefined;
        cmd.permissions.forEach((perm: bigint) => {
            if(!interaction.memberPermissions?.has(perm)) notEnoughPermission = perm;
        });
        if(notEnoughPermission){
            await interaction.reply(notEnoughPermission);
        }
    }

    await cmd?.callback(client,interaction);
}