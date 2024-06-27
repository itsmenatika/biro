"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommandInformation = exports.getFullDictOf = exports.getMessage = void 0;
const pl_json = require("../../localization/pl.json");
const en_json = require("../../localization/en.json");
const types_1 = require("./types");
function getMessage(message, loc) {
    if (loc == "en-US" || loc == "en-GB") {
        loc = types_1.localization.en;
    }
    try {
        switch (loc) {
            case types_1.localization.pl: {
                return pl_json[message] === undefined ? `${message.replace("_", "x")}x${loc.toLocaleLowerCase()}` : String(pl_json[message]);
            }
            case types_1.localization.en: {
                return en_json[message] === undefined ? `${message.replace("_", "x")}x${loc.toLocaleLowerCase()}` : String(en_json[message]);
            }
        }
    }
    catch (error) {
        console.log("Error occured!");
        console.log(`util/langtools.ts loc: ${loc}   message: ${message}`);
        return `${message}0${types_1.localization}`;
    }
    console.log("Something went terribly wrong, that line of code shouldn't even be possible to execute!");
    console.log(`util/langtools.ts loc: ${loc}   message: ${message}`);
    return "wtf";
}
exports.getMessage = getMessage;
function getFullDictOf(message) {
    return {
        "pl": getMessage(message, types_1.localization.pl),
    };
}
exports.getFullDictOf = getFullDictOf;
function addCommandInformation(command, commandName) {
    return command.setName(getMessage(`cmd_${commandName}_name`, types_1.localization.en))
        .setDescription(getMessage(`cmd_${commandName}_desc`, types_1.localization.en))
        .setNameLocalizations(getFullDictOf(`cmd_${commandName}_name`))
        .setDescriptionLocalizations(getFullDictOf(`cmd_${commandName}_desc`));
}
exports.addCommandInformation = addCommandInformation;
//# sourceMappingURL=langtools.js.map