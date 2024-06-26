import { Client, Interaction, Collection, REST, Routes } from "discord.js";
import {readdirSync} from 'fs';
import {join as pathJoin} from 'path';
import type { cmdData } from "../../util/types";

declare global {
    var commandData: Collection<String, cmdData>;
    var commandCategoryData: Collection<string, Array<String>>;
}

module.exports = async (client: Client, interaction: Interaction) => {
    console.log("registering commands... START")

    var commandCategories = readdirSync(pathJoin(__dirname, "..", "..", "commands"), {withFileTypes: true});

    var commandDataForRest: Object[] = [];
    
    global.commandData = new Collection();
    global.commandCategoryData = new Collection();


    commandCategories.forEach((commandCategory) => {
        console.log(`command register: category commands/${commandCategory.name} START`);
        global.commandCategoryData.set(commandCategory.name, []);
        if(!commandCategory.isDirectory()){
            console.log(`command register: category commands/${commandCategory.name} - ERROR: not a directory`);
            return;
        }

        let commands = readdirSync(pathJoin(__dirname, "..", "..", "commands", commandCategory.name), {withFileTypes: true});
        commands = commands.sort((a,b) => Number(a.name < b.name));
        commands.forEach((command) => {
            if(command.isDirectory()){
                console.log(`command register: command commands/${commandCategory.name}/${command.name} - SKIPPED (it's directory)`);
                return;
            }

            if(command.name.split(".").pop() != "js"){
                console.log(`command register: command commands/${commandCategory.name}/${command.name} - SKIPPED (not JS)`);
                return;
            }

            

            // checking if command is okay

            let commandFile: cmdData = require(pathJoin(__dirname, "..", "..", "commands", commandCategory.name, command.name));
            
            if(!commandFile.hasOwnProperty("data")){
                console.log(`command register: command commands/${commandCategory.name}/${command.name} - ERROR: no data`);
                return;
            }

            if(!commandFile.hasOwnProperty("callback")){
                console.log(`command register: command commands/${commandCategory.name}/${command.name} - ERROR: no callback`);
                return;
            }

            let NewNameDict: String[] = command.name.split("."); NewNameDict.pop();
            const newName: String = NewNameDict.join("");

            // registering
            commandDataForRest.push(commandFile['data']);
            global.commandData.set(newName, commandFile);
            global.commandCategoryData.get(commandCategory.name)?.push(newName);


            console.log(`command register: command commands/${commandCategory.name}/${command.name}`);
        });

        console.log(`command register: category commands/${commandCategory.name} DONE`);
    });

    console.log("registering commands... DONE")

    console.log("sending slash commands via REST API... Starting...");
    
    const rest: REST = new REST().setToken(String(process.env.DISCORDTOKEN));
    (async () => {
        console.log("sending slash commands via REST API... Sending...");
        const data = await rest.put(
            Routes.applicationGuildCommands(String(process.env.DISCORDAPPID), String(process.env.DISCORDTESTGUILD)),
            {
                body: commandDataForRest
            }
        ).catch((err) => {
            console.log(`REST API ERROR: {err}`);
        });

        console.log("sending slash commands via REST API... Sent!...");
    })();

}