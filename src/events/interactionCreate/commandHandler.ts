import { BitField, Client, Interaction, PermissionsBitField } from "discord.js";
import { localization } from "../../util/types";
import { errorBuilder } from "../../util/embtools";
import { getMessage } from "../../util/langtools";



module.exports = async (client: Client, interaction: Interaction, loc: localization) => {
    // console.log(interaction);
    if(!interaction.isCommand()) return;

    const cmd = global.commandData.get(interaction.commandName);

    if(!cmd){
        await interaction.reply({ embeds: [
            errorBuilder("commandNotFound", interaction, loc, {commandName: String(cmd)})
        ]});
        // await interaction.reply("interaction error, that command doesnt exist!");
        return;
    }

    // user permissions
    if(cmd.permissions){
        // get names from bigints
        let lackPermissionsString: string[] = [];
        cmd.permissions.forEach(permission => {
            // check if user has this permission
            if(interaction.memberPermissions?.has(permission)) return;

            for(const permFlag of Object.keys(PermissionsBitField.Flags)){
                // @ts-ignore
                if(PermissionsBitField.Flags[permFlag] === permission){
                    lackPermissionsString.push(
                        getMessage(`perm_${permFlag}`,loc)
                    )
                }
            }
        });

        //send message and end if it should be ended
        if(lackPermissionsString.length > 0){
            await interaction.reply({ embeds: [
                errorBuilder("userPermissions", interaction, loc, {permName: lackPermissionsString.reduce((prev, next) => prev + ", " + next)})
            ]});
            return;
        }
    }

    // bot permissions
    if(cmd.botPermissions){
        // get names from bigints
        let lackPermissionsString: string[] = [];
        cmd.botPermissions.forEach(permission => {
            // check if bot has this permission
            if(interaction.guild?.members.me?.permissions.has(permission)) return;

            for(const permFlag of Object.keys(PermissionsBitField.Flags)){
                // @ts-ignore
                if(PermissionsBitField.Flags[permFlag] === permission){
                    lackPermissionsString.push(
                        getMessage(`perm_${permFlag}`,loc)
                    )
                }
            }
        });

        //send message and end if it should be ended
        if(lackPermissionsString.length > 0){
            await interaction.reply({ embeds: [
                errorBuilder("botPermissions", interaction, loc, {permName: lackPermissionsString.reduce((prev, next) => prev + ", " + next)})
            ]});
            return;
        }
    }

    await cmd?.callback(client,interaction, loc);
}


