"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const path_1 = require("path");
const mysqltools_1 = require("./util/mysqltools");
const canvacord_1 = require("canvacord");
require("dotenv").config();
console.log("loading...");
console.log("loading canvacord...");
canvacord_1.Font.loadDefault();
console.log("loading canvacord... DONE");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.IntentsBitField.Flags.Guilds,
        discord_js_1.IntentsBitField.Flags.GuildModeration,
        discord_js_1.IntentsBitField.Flags.MessageContent,
        discord_js_1.IntentsBitField.Flags.GuildMessages
    ]
});
var connection;
(async () => {
    console.log("loading database...");
    connection = await (0, mysqltools_1.getConnection)(String(process.env.MYSQLHOST), String(process.env.MYSQLUSER), String(process.env.MYSQLPASSWORD), String(process.env.MYSQLDATABASE));
})();
console.log("registering events");
var eventTypes = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, "events"), { withFileTypes: true });
eventTypes.forEach((eventType) => {
    if (!eventType.isDirectory()) {
        console.log(`Event ${eventType.name} is not a directory!`);
        return;
    }
    console.log(`EVENTS: registering events/${eventType.name} START`);
    let events = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, "events", eventType.name), { withFileTypes: true });
    events = events.sort((a, b) => Number(a < b));
    let eventFiles = [];
    events.forEach((event) => {
        if (event.isDirectory()) {
            console.log(`EVENTS: registering events/${eventType.name}/${event.name} ERROR - that's directory`);
            return;
        }
        if (event.name.split(".").pop() != "js") {
            console.log(`EVENTS: registering events/${eventType.name}/${event.name} SKIPPED - not javascript`);
            return;
        }
        console.log(`EVENTS: registering events/${eventType.name}/${event.name}`);
        eventFiles.push(require((0, path_1.join)(__dirname, "events", eventType.name, event.name)));
    });
    client.on(eventType.name, async (interaction) => {
        for (let eventFile of eventFiles) {
            await eventFile(client, interaction, interaction.locale, connection);
        }
    });
    console.log(`EVENTS: registering events/${eventType.name} DONE`);
});
client.login(process.env.DISCORDTOKEN);
console.log("bot connected to the discord!");
