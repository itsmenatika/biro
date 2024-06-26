import { Client, CommandInteraction } from "discord.js";

type callbackFunction = (client: Client, interaction: CommandInteraction) => Promise<Boolean | void>;

interface cmdData {
    data: Object,
    callback: callbackFunction,
    cooldown?: Number,   
}
export type {cmdData}
