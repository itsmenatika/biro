"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = async (client, interaction) => {
    if (!interaction.isCommand())
        return;
    const cmd = global.commandData.get(interaction.commandName);
    if (!cmd) {
        await interaction.reply("interaction error, that command doesnt exist!");
        return;
    }
    if (cmd.permissions) {
        var notEnoughPermission = undefined;
        cmd.permissions.forEach((perm) => {
            if (!interaction.memberPermissions?.has(perm))
                notEnoughPermission = perm;
        });
        if (notEnoughPermission) {
            await interaction.reply(notEnoughPermission);
        }
    }
    await cmd?.callback(client, interaction);
};
//# sourceMappingURL=commandHandler.js.map