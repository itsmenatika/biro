"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfoInGuild = exports.addUserXP = exports.ensureThatUserInGuildDoExistInDatabase = exports.ensureThatUserDoExistInDatabase = exports.ensureThatGuildDoExistInDatabase = exports.getConnection = exports.ensureThatAllTablesDoExist = void 0;
const mysql2_1 = require("mysql2");
async function getConnection(host, user, password, database) {
    console.log("creating connection to mysql database...");
    const pool = (0, mysql2_1.createPool)({
        host: host,
        user: user,
        password: password,
        database: database,
        connectionLimit: 10
    });
    await ensureThatAllTablesDoExist(pool);
    console.log("creating connection to mysql database... DONE");
    return pool;
}
exports.getConnection = getConnection;
async function ensureThatAllTablesDoExist(connection) {
    console.log("recreating table structure...");
    const prom = connection.promise();
    const poolcon = await prom.getConnection();
    await poolcon.beginTransaction();
    await poolcon.query(`CREATE TABLE IF NOT EXISTS discordguilds(guildID varchar(20) PRIMARY KEY, logChannel varchar(20))`);
    await poolcon.query(`CREATE TABLE IF NOT EXISTS discordchannels(channelID varchar(20) PRIMARY KEY, guildID varchar(20), FOREIGN KEY (guildID) REFERENCES discordguilds(guildID))`);
    await poolcon.query(`CREATE TABLE IF NOT EXISTS discordusers(userID varchar(20) PRIMARY KEY, status tinyint DEFAULT 0)`);
    await poolcon.query(`CREATE TABLE IF NOT EXISTS discordusersguild(userID varchar(20), guildID varchar(20), level int NOT NULL DEFAULT 0, xpToNextLevel int NOT NULL default 35, xpNow int NOT NULL default 0, FOREIGN KEY (userID) REFERENCES discordusers(userID), FOREIGN KEY (guildID) REFERENCES discordguilds(guildID))`);
    await poolcon.commit();
    await poolcon.destroy();
    console.log("recreating table structure... DONE");
}
exports.ensureThatAllTablesDoExist = ensureThatAllTablesDoExist;
async function getUserInfoInGuild(connection, userID, guildID) {
    const promiseCon = connection.promise();
    const con = await promiseCon.getConnection();
    await con.beginTransaction();
    try {
        const stm = await con.prepare("SELECT * from discordusers INNER JOIN discordusersguild ON discordusers.userID = discordusersguild.userID WHERE discordusers.userID = ? AND discordusersguild.guildID = ?");
        const result = await stm.execute([userID, guildID]);
        await stm.close();
        if (!(result[0] instanceof Array))
            throw Error("not array");
        if (result[0].length > 0) {
            await con.destroy();
            return result[0][0];
        }
    }
    catch (err) {
        console.log("error, ensureThatGuildDoExist", err);
        await con.rollback;
        await con.destroy();
        return undefined;
    }
    await con.commit();
    await con.destroy();
    return 0;
}
exports.getUserInfoInGuild = getUserInfoInGuild;
async function addUserXP(connection, userID, guildID, amount) {
    const promiseCon = connection.promise();
    const con = await promiseCon.getConnection();
    await con.beginTransaction();
    try {
        const stm = await con.prepare("UPDATE discordusersguild SET xpNow=xpNow+?, level=IF(xpNow>=xpToNextLevel, level+1, level), xpToNextLevel=(35*level)*level+35");
        const result = await stm.execute([amount]);
        const result2 = await stm.execute([0]);
        await stm.close();
    }
    catch (err) {
        console.log("error, ensureThatGuildDoExist", err);
        await con.rollback;
        await con.destroy();
        return undefined;
    }
    await con.commit();
    await con.destroy();
    return 0;
}
exports.addUserXP = addUserXP;
async function ensureThatUserInGuildDoExistInDatabase(connection, userID, guildID) {
    await ensureThatGuildDoExistInDatabase(connection, guildID);
    await ensureThatUserDoExistInDatabase(connection, userID);
    const promiseCon = connection.promise();
    const con = await promiseCon.getConnection();
    await con.beginTransaction();
    try {
        const stm = await con.prepare("SELECT * from discordusersguild where userID = ? and guildID = ?");
        const result = await stm.execute([userID, guildID]);
        if (!(result[0] instanceof Array))
            throw Error("??? somehow it's not an array");
        if (result[0].length == 0) {
            const stm2 = await con.prepare("insert into discordusersguild (userID, guildID) VALUES (?, ?)");
            await stm2.execute([userID, guildID]);
            await stm2.close();
        }
        await stm.close();
    }
    catch (err) {
        console.log("error, ensureThatGuildDoExist", err);
        await con.rollback;
        await con.destroy();
        return;
    }
    await con.commit();
    await con.destroy();
}
exports.ensureThatUserInGuildDoExistInDatabase = ensureThatUserInGuildDoExistInDatabase;
async function ensureThatUserDoExistInDatabase(connection, userID) {
    const promiseCon = connection.promise();
    const con = await promiseCon.getConnection();
    await con.beginTransaction();
    try {
        const stm = await con.prepare("SELECT * from discordusers where userID = ?");
        const result = await stm.execute([userID]);
        if (!(result[0] instanceof Array))
            throw Error("??? somehow it's not an array");
        if (result[0].length == 0) {
            const stm2 = await con.prepare("insert into discordusers (userID) VALUES (?)");
            await stm2.execute([userID]);
            await stm2.close();
        }
        await stm.close();
    }
    catch (err) {
        console.log("error, ensureThatGuildDoExist", err);
        await con.rollback;
        return;
    }
    await con.commit();
    await con.destroy();
}
exports.ensureThatUserDoExistInDatabase = ensureThatUserDoExistInDatabase;
async function ensureThatGuildDoExistInDatabase(connection, guildID) {
    const promiseCon = connection.promise();
    const con = await promiseCon.getConnection();
    await con.beginTransaction();
    try {
        const stm = await con.prepare("SELECT * from discordguilds where guildID = ?");
        const result = await stm.execute([guildID]);
        if (!(result[0] instanceof Array))
            throw Error("??? somehow it's not an array");
        if (result[0].length == 0) {
            const stm2 = await con.prepare("insert into discordGUILDS (guildID) VALUES (?)");
            await stm2.execute([guildID]);
            await stm2.close();
        }
        await stm.close();
    }
    catch (err) {
        console.log("error, ensureThatGuildDoExist", err);
        await con.rollback;
        return;
    }
    await con.commit();
    await con.destroy();
}
exports.ensureThatGuildDoExistInDatabase = ensureThatGuildDoExistInDatabase;
