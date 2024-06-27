const pl_json: Record<string, any> = require("../../localization/pl.json");
const en_json: Record<string, any> = require("../../localization/en.json");

import { SlashCommandBuilder } from "discord.js";
import { localization } from "./types";
import { DynamicStyleObject } from "./types";


function getMessage(message: string, loc: localization): string{
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
        return `${message}0${localization}`;
    }

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

export {getMessage, getFullDictOf, addCommandInformation}

// module.exports = {
//     getMessage: getMessage,
//     getFullDictOf: getFullDictOf,
//     addCommandInformation: addCommandInformation
// }