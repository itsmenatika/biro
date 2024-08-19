"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const embtools_1 = require("../../util/embtools");
const langtools_1 = require("../../util/langtools");
module.exports = async (client, interaction, loc) => {
    if (!interaction.isCommand())
        return;
    const cmd = global.commandData.get(interaction.commandName);
    if (!cmd) {
        await interaction.reply({ embeds: [
                (0, embtools_1.errorBuilder)("commandNotFound", interaction, loc, { commandName: String(cmd) })
            ] });
        return;
    }
    if (cmd.permissions) {
        let lackPermissionsString = [];
        cmd.permissions.forEach(permission => {
            if (interaction.memberPermissions?.has(permission))
                return;
            for (const permFlag of Object.keys(discord_js_1.PermissionsBitField.Flags)) {
                if (discord_js_1.PermissionsBitField.Flags[permFlag] === permission) {
                    lackPermissionsString.push((0, langtools_1.getMessage)(`perm_${permFlag}`, loc));
                }
            }
        });
        if (lackPermissionsString.length > 0) {
            await interaction.reply({ embeds: [
                    (0, embtools_1.errorBuilder)("userPermissions", interaction, loc, { permName: lackPermissionsString.reduce((prev, next) => prev + ", " + next) })
                ] });
            return;
        }
    }
    if (cmd.botPermissions) {
        let lackPermissionsString = [];
        cmd.botPermissions.forEach(permission => {
            if (interaction.guild?.members.me?.permissions.has(permission))
                return;
            for (const permFlag of Object.keys(discord_js_1.PermissionsBitField.Flags)) {
                if (discord_js_1.PermissionsBitField.Flags[permFlag] === permission) {
                    lackPermissionsString.push((0, langtools_1.getMessage)(`perm_${permFlag}`, loc));
                }
            }
        });
        if (lackPermissionsString.length > 0) {
            await interaction.reply({ embeds: [
                    (0, embtools_1.errorBuilder)("botPermissions", interaction, loc, { permName: lackPermissionsString.reduce((prev, next) => prev + ", " + next) })
                ] });
            return;
        }
    }
    await cmd?.callback(client, interaction, loc);
};
