"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommandInformation = exports.getFullDictOf = exports.getMessage = void 0;
const pl_json = require("../../localization/pl.json");
const en_json = require("../../localization/en.json");
const types_1 = require("./types");
function getMessage(message, loc) {
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
        return `${message}0${types_1.localization}`;
    }
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