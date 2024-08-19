const pl_json: Record<string, any> = require("../../localization/pl.json");
const en_json: Record<string, any> = require("../../localization/en.json");

import { SlashCommandBuilder } from "discord.js";
import { localization } from "./types";
import { DynamicStyleObject } from "./types";


function getMessage(message: string, loc: localization): string{
    if(loc as String == "en-US" || loc as String == "en-GB"){
        loc = localization.en;
    }
    try {
        switch(loc){
            case localization.pl: {
                return pl_json[message as keyof typeof en_json] === undefined ? `${message.replace("_", "x")}x${loc.toLocaleLowerCase()}` : String(pl_json[message as keyof typeof en_json]);
            }
            case localization.en: {
                return en_json[message as keyof typeof en_json] === undefined ? `${message.replace("_", "x")}x${loc.toLocaleLowerCase()}` : String(en_json[message as keyof typeof en_json]);
            }
        }  
    } catch (error) {
        console.log("Error occured!");
        console.log(`util/langtools.ts loc: ${loc}   message: ${message}`)
        return `${message}0${localization}`;
    }

    console.log("Something went terribly wrong, that line of code shouldn't even be possible to execute!");
    console.log(`util/langtools.ts loc: ${loc}   message: ${message}`)

    // because typescript doesnt like me, that will never occur
    return "wtf";
}

function getFullDictOf(message: string): Object {
    return {
        "pl": getMessage(message, localization.pl),
    }
}

function addCommandInformation(command: SlashCommandBuilder, commandName: string): SlashCommandBuilder{
    return command.setName(getMessage(`cmd_${commandName}_name`, localization.en))
    .setDescription(getMessage(`cmd_${commandName}_desc`, localization.en))
    .setNameLocalizations(getFullDictOf(`cmd_${commandName}_name`))
    .setDescriptionLocalizations(getFullDictOf(`cmd_${commandName}_desc`));
}

/**
 * allows you to parse messages with arguments written like that [$argument]
 * @param {message} message entry in localization json
 * @param {localization} loc what localization do you want take from
*  @param {Record<string, string>} addInfo table of arguments
 * @return {string} parsed json entry
 */
function parseMessage(message: string, loc: localization, addinfo: Record<string, string>): string{
    // declare 
    let temp: string = getMessage(message, loc);

    // parse
    for(let key in addinfo){
        while(temp.includes(`[$${key}]`)){
            temp = temp.replace(`[$${key}]`, addinfo[key]);
        }
    }

    // just return
    return temp;
}

export {getMessage, getFullDictOf, addCommandInformation, parseMessage}

// module.exports = {
//     getMessage: getMessage,
//     getFullDictOf: getFullDictOf,
//     addCommandInformation: addCommandInformation
// }