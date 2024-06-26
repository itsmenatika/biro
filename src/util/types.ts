import { Client, CommandInteraction, PermissionsBitField } from "discord.js";

type callbackFunction = (client: Client, interaction: CommandInteraction) => Promise<Boolean | void>;


// export function isValidPermission(permission: undefined | PermissionsBitField): permission is bigi {
//     return permission !== undefined;
// }
interface cmdData {
    data: Object,
    callback: callbackFunction,
    cooldown?: Number,   
    permissions?: bigint[],
    botPermissions?: bigint[],
}
export type {cmdData}
