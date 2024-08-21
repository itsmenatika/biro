import { Client, IntentsBitField, Interaction } from "discord.js";
import { readdirSync } from "fs";
import {join as pathJoin} from "path";
import { getConnection } from "./util/mysqltools";
import { Pool } from "mysql2/typings/mysql/lib/Pool";
import {Font as fontCanvacord} from 'canvacord';

require("dotenv").config();



console.log("loading...");

console.log("loading canvacord...");
fontCanvacord.loadDefault()
console.log("loading canvacord... DONE");

const client: Client =  new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildModeration,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessages
    ]
});

var connection: Promise<Pool> | Pool;
( async () => {
    console.log("loading database...")
    connection = await getConnection(String(process.env.MYSQLHOST), 
    String(process.env.MYSQLUSER), String(process.env.MYSQLPASSWORD), String(process.env.MYSQLDATABASE));
})();
console.log("registering events");

var eventTypes = readdirSync(pathJoin(__dirname, "events"), {withFileTypes: true});


eventTypes.forEach((eventType) => {
    // event should be in directory first
    if(!eventType.isDirectory()){
        console.log(`Event ${eventType.name} is not a directory!`);
        return;
    }

    console.log(`EVENTS: registering events/${eventType.name} START`);

    // get all events of this type
    let events = readdirSync(pathJoin(__dirname, "events", eventType.name), {withFileTypes: true});

    events = events.sort((a ,b) => Number(a < b));


    // register event of this type
    let eventFiles: any[] = [];

    events.forEach((event) => {
        if(event.isDirectory()){
            console.log(`EVENTS: registering events/${eventType.name}/${event.name} ERROR - that's directory`);
            return;
        }

        if(event.name.split(".").pop() != "js"){
            console.log(`EVENTS: registering events/${eventType.name}/${event.name} SKIPPED - not javascript`);
            return;           
        }

        console.log(`EVENTS: registering events/${eventType.name}/${event.name}`)

        eventFiles.push(require(pathJoin(__dirname, "events", eventType.name, event.name)));

    });
 
    client.on(eventType.name, async (interaction: Interaction) => {
        for(let eventFile of eventFiles){
            await eventFile(client, interaction, interaction.locale, connection);
        }
    });

    console.log(`EVENTS: registering events/${eventType.name} DONE`)


    
});



client.login(process.env.DISCORDTOKEN);
console.log("bot connected to the discord!");