"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = async (client, interaction) => {
    if (!interaction.isCommand())
        return;
    const cmd = global.commandData.get(interaction.commandName);
    console.log(cmd);
    await cmd?.callback(client, interaction);
};
//# sourceMappingURL=commandHandler.js.map