"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const path_1 = require("path");
const langtools_1 = require("../../util/langtools");
module.exports = async (client, interaction) => {
    console.log("registering commands... START");
    var commandCategories = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, "..", "..", "commands"), { withFileTypes: true });
    var commandDataForRest = [];
    global.commandData = new discord_js_1.Collection();
    global.commandCategoryData = new discord_js_1.Collection();
    commandCategories.forEach((commandCategory) => {
        console.log(`command register: category commands/${commandCategory.name} START`);
        global.commandCategoryData.set(commandCategory.name, []);
        if (!commandCategory.isDirectory()) {
            console.log(`command register: category commands/${commandCategory.name} - ERROR: not a directory`);
            return;
        }
        let commands = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, "..", "..", "commands", commandCategory.name), { withFileTypes: true });
        commands = commands.sort((a, b) => Number(a.name < b.name));
        commands.forEach((command) => {
            if (command.isDirectory()) {
                console.log(`command register: command commands/${commandCategory.name}/${command.name} - SKIPPED (it's directory)`);
                return;
            }
            if (command.name.split(".").pop() != "js") {
                console.log(`command register: command commands/${commandCategory.name}/${command.name} - SKIPPED (not JS)`);
                return;
            }
            let commandFile = require((0, path_1.join)(__dirname, "..", "..", "commands", commandCategory.name, command.name));
            if (!commandFile.hasOwnProperty("data")) {
                console.log(`command register: command commands/${commandCategory.name}/${command.name} - ERROR: no data`);
                return;
            }
            if (!commandFile.hasOwnProperty("callback")) {
                console.log(`command register: command commands/${commandCategory.name}/${command.name} - ERROR: no callback`);
                return;
            }
            let NewNameDict = command.name.split(".");
            NewNameDict.pop();
            const newName = NewNameDict.join("");
            if (commandFile.hasOwnProperty("addInfo") && commandFile.addInfo) {
                commandFile.data = (0, langtools_1.addCommandInformation)(commandFile.data, newName);
            }
            commandDataForRest.push(commandFile['data']);
            global.commandData.set(newName, commandFile);
            global.commandCategoryData.get(commandCategory.name)?.push(newName);
            console.log(`command register: command commands/${commandCategory.name}/${command.name}`);
        });
        console.log(`command register: category commands/${commandCategory.name} DONE`);
    });
    console.log("registering commands... DONE");
    console.log("sending slash commands via REST API... Starting...");
    const rest = new discord_js_1.REST().setToken(String(process.env.DISCORDTOKEN));
    (async () => {
        console.log("sending slash commands via REST API... Sending...");
        const data = await rest.put(discord_js_1.Routes.applicationGuildCommands(String(process.env.DISCORDAPPID), String(process.env.DISCORDTESTGUILD)), {
            body: commandDataForRest
        }).catch((err) => {
            console.log(`REST API ERROR: {err}`);
        });
        console.log("sending slash commands via REST API... Sent!...");
    })();
};
//# sourceMappingURL=commandRegister.js.map