import { Client, CommandInteraction, PermissionsBitField } from "discord.js";

type callbackFunction = (client: Client, interaction: CommandInteraction) => Promise<Boolean | void>;

enum localization {
    pl = "PL",
    en = "EN",
    en_GB = "EN",
    en_UK = "EN"
}

interface DynamicStyleObject {
    [ key : string ] : string|number|null|undefined;
  }

interface localization_data {
    interfaceLocalization: localization,
    assignedLocalization: localization
}

// interface loc {
//     assignedLoc: Enumerator<
// }

// export function isValidPermission(permission: undefined | PermissionsBitField): permission is bigi {
//     return permission !== undefined;
// }
interface cmdData {
    data: Object,
    callback: callbackFunction,
    cooldown?: Number,   
    permissions?: bigint[],
    addInfo?: boolean,
    botPermissions?: bigint[],
}

export type {cmdData}
// export type {localization}
export type {DynamicStyleObject}
export {localization}
export type {localization_data}
