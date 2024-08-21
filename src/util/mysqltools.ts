
import {createPool} from "mysql2";
import {FieldPacket, OkPacket, PoolConnection, Pool as PoolProm, ResultSetHeader, RowDataPacket} from "mysql2/promise";
import { Pool } from "mysql2/typings/mysql/lib/Pool";

interface connectionAuthData {
    host: string,
    port: Number,
    user: string,
    password: string,
}

async function getConnection(host: string, user: string, password: string, database: string): Promise<Pool>{
    console.log("creating connection to mysql database...");
    const pool: Pool = createPool({
        host: host,
        user: user,
        password: password,
        database: database,
        connectionLimit: 10
    });
    // console.log(pool);
    await ensureThatAllTablesDoExist(pool);
    console.log("creating connection to mysql database... DONE");
    return pool
}


async function ensureThatAllTablesDoExist(connection: Pool){
    console.log("recreating table structure...");
    const prom: PoolProm = connection.promise();
    
    const poolcon: PoolConnection = await prom.getConnection();

    await poolcon.beginTransaction();

    await poolcon.query(`CREATE TABLE IF NOT EXISTS discordguilds(guildID varchar(20) PRIMARY KEY, logChannel varchar(20))`);

    await poolcon.query(`CREATE TABLE IF NOT EXISTS discordchannels(channelID varchar(20) PRIMARY KEY, guildID varchar(20), FOREIGN KEY (guildID) REFERENCES discordguilds(guildID))`);

    await poolcon.query(`CREATE TABLE IF NOT EXISTS discordusers(userID varchar(20) PRIMARY KEY, status tinyint DEFAULT 0)`);

    await poolcon.query(`CREATE TABLE IF NOT EXISTS discordusersguild(userID varchar(20), guildID varchar(20), level int NOT NULL DEFAULT 0, xpToNextLevel int NOT NULL default 35, xpNow int NOT NULL default 0, FOREIGN KEY (userID) REFERENCES discordusers(userID), FOREIGN KEY (guildID) REFERENCES discordguilds(guildID))`)

    await poolcon.commit();
    await poolcon.destroy()
    console.log("recreating table structure... DONE");
}

// interface channelData{
//     refetch: CallableFunction,
//     guildID: string,
//     getGuild: CallableFunction,


// }

// interface guildData{
//     refetch: CallableFunction,
//     justAdded: boolean,
//     guildID: string,
//     getLogChannelID: string | undefined,
//     getLogChannel: CallableFunction,
//     // save: CallableFunction
// }

// interface userData{
//     refetch: CallableFunction,
//     userID: string,
//     isBanned: boolean,
//     global: true
// }

// interface userDataInGuild extdestroys userData{
//     guildID: string,
//     getGuild: CallableFunction,
//     xp: number,
//     level: number,
//     toNextLevel: number,
//     totalXp: number
// }


// // async function getUserViaID(connection: Pool, id: string, guildID?: string): Promise<userData|userDataInGuild>{
// //     // create connection from promise
// //     const promiseCon: PoolProm = connection.promise();

// //     const con: PoolConnection = await promiseCon.getConnection()

// //     // with guild
// //     if(guildID){
// //         return {
// //             refetch: async () => await getUserViaID(connection, id, guildID),
// //             userID: id,

// //             guildID: guildID,
// //             getGuild: async () => await getGuildViaID(connection,)
// //         }
// //     }
// //     else{
// //         // without
// //         return {
// //             refetch: async () => getUserViaID(connection, id),
// //             userID: id,

// //         }
// //     }

// //     return;
    
// // }


// // async function saveGuildData(connection: Pool, id: string, data: guildData): Promise<guildData> {
// //     // create connection from promise
// //     const promiseCon: PoolProm = connection.promise();

// //     const con: PoolConnection = await promiseCon.getConnection()

// //     // sdestroy data
// //     const stm = await con.prepare("update discordguilds set logChannel = ? where guildID = ?");
// //     const result: [(
// //         | RowDataPacket[][]
// //         | RowDataPacket[]
// //         | OkPacket
// //         | OkPacket[]
// //         | ResultSetHeader
// //       ),
// //       FieldPacket[],
// //     ] = await stm.execute([data.logChannelID != undefined ? data.logChannelID : null, id]);

// //     // return data
// //     return data;
// // }

// async function getLogChannelID(connection: Pool, guildID: string): Promise<string|
// undefined>{
//     // create connection from promise
//     const promiseCon: PoolProm = connection.promise();

//     const con: PoolConnection = await promiseCon.getConnection();

//     const stm = await con.prepare("select logChannel from discordguilds WHERE guildID = ?");
//     const result: [(
//         | RowDataPacket[][]
//         | RowDataPacket[]
//         | OkPacket
//         | OkPacket[]
//         | ResultSetHeader
//       ),
//       FieldPacket[],
//     ] = await stm.execute([guildID]);
//     await stm.close()

//     if(!(result[0] instanceof Array)) return undefined;

//     if(result[0].length > 0) return result[0]["logChannel" as keyof instanceo]
//     return undefined;
// }

// async function getGuildViaID(connection: Pool, id: string): Promise<any>{
//     // create connection from promise
//     const promiseCon: PoolProm = connection.promise();

//     const con: PoolConnection = await promiseCon.getConnection();

//     // get guild data
//     const stm = await con.prepare("select * from discordguilds WHERE guildID = ?");
//     const result: [(
//         | RowDataPacket[][]
//         | RowDataPacket[]
//         | OkPacket
//         | OkPacket[]
//         | ResultSetHeader
//       ),
//       FieldPacket[],
//     ] = await stm.execute([id]);
//     await stm.close()

//     // if somehow this is not array return undefined
//     if(!(result[0] instanceof Array)) return;

//     // check if there entry about this guild
//     if(result[0].length == 0){
//         // if not create new
//         const stm2 = await con.prepare("insert into discordGUILDS (guildID) VALUES (?)");
//         const result2 = await stm2.execute([id]);
        
//         const obj: guildData = {
//             refetch: async (): Promise<guildData|null> => {
//                 return getGuildViaID(connection, id)
//             },
//             justAdded: true,
//             guildID: id,
//             logChannelID: undefined,
//             getLogChannel: async () => undefined,
//             // @ts-ignore
//             save: async () => await saveGuildData(connection, id, obj)
//         };
//         return obj;
//     }
//     else{
//         const obj: guildData = {
//             refetch: async (): Promise<guildData|null> => {
//                 return getGuildViaID(connection, id)
//             },
//             justAdded: false,
//             guildID: id,
//             // @ts-ignore
//             logChannelID: result[0]['guildID'],
//             getLogChannel: async () => {

//             },
//             // @ts-ignore
//             save: async () => await saveGuildData(connection, id, obj)
//         };
//         return obj;
//     }

    
    
//     return;
    
// }

async function getUserInfoInGuild(connection: Pool, userID: string, guildID: string): Promise<Object|undefined>{
     // create connections
     const promiseCon: PoolProm = connection.promise();

     const con: PoolConnection = await promiseCon.getConnection();

     await con.beginTransaction();

     try{
         const stm = await con.prepare("SELECT * from discordusers INNER JOIN discordusersguild ON discordusers.userID = discordusersguild.userID WHERE discordusers.userID = ? AND discordusersguild.guildID = ?");
         const result: [(
             | RowDataPacket[][]
             | RowDataPacket[]
             | OkPacket
             | OkPacket[]
             | ResultSetHeader
             ),
             FieldPacket[],
         ]  = await stm.execute([userID, guildID]);

         await stm.close();
         if(!(result[0] instanceof Array)) throw Error("not array");
         if(result[0].length > 0){
            await con.destroy();
            // @ts-ignore
            return result[0][0]
         }

     }
     catch(err){
         console.log("error, ensureThatGuildDoExist", err);
         await con.rollback;
         await con.destroy();
         return undefined;
     }
 
     await con.commit();
     await con.destroy();
     return 0;
     
}

async function addUserXP(connection: Pool, userID: string, guildID: string, amount: Number): Promise<Number|undefined>{
    // create connections
    const promiseCon: PoolProm = connection.promise();

    const con: PoolConnection = await promiseCon.getConnection();

    await con.beginTransaction();

    try{
        const stm = await con.prepare("UPDATE discordusersguild SET xpNow=xpNow+?, level=IF(xpNow>=xpToNextLevel, level+1, level), xpToNextLevel=(35*level)*level+35");
        const result: [(
            | RowDataPacket[][]
            | RowDataPacket[]
            | OkPacket
            | OkPacket[]
            | ResultSetHeader
            ),
            FieldPacket[],
        ]  = await stm.execute([amount]);
        const result2: [(
            | RowDataPacket[][]
            | RowDataPacket[]
            | OkPacket
            | OkPacket[]
            | ResultSetHeader
            ),
            FieldPacket[],
        ]  = await stm.execute([0]);
        await stm.close();
    }
    catch(err){
        console.log("error, ensureThatGuildDoExist", err);
        await con.rollback;
        await con.destroy();
        return undefined;
    }

    await con.commit();
    await con.destroy();
    return 0;
}

async function ensureThatUserInGuildDoExistInDatabase(connection: Pool, userID: string, guildID: string): Promise<void> {
    // ensure that discord guild do exist
    await ensureThatGuildDoExistInDatabase(connection, guildID);
    // ensure that global user do exist
    await ensureThatUserDoExistInDatabase(connection, userID);

    // create connections
    const promiseCon: PoolProm = connection.promise();

    const con: PoolConnection = await promiseCon.getConnection();

    await con.beginTransaction();

    try{
        const stm = await con.prepare("SELECT * from discordusersguild where userID = ? and guildID = ?");
        const result: [(
            | RowDataPacket[][]
            | RowDataPacket[]
            | OkPacket
            | OkPacket[]
            | ResultSetHeader
            ),
            FieldPacket[],
        ]  = await stm.execute([userID, guildID]);
        
        if(!(result[0] instanceof Array)) throw Error("??? somehow it's not an array");

        // if doesn't exist
        if(result[0].length==0){
            const stm2 = await con.prepare("insert into discordusersguild (userID, guildID) VALUES (?, ?)");
            await stm2.execute([userID, guildID]);
            await stm2.close();
        }
        await stm.close();
    }
    catch(err){
        console.log("error, ensureThatGuildDoExist", err);
        await con.rollback;
        await con.destroy();
        return;
    }

    await con.commit();
    await con.destroy();
}

async function ensureThatUserDoExistInDatabase(connection: Pool, userID: string): Promise<void> {
    // create connections
    const promiseCon: PoolProm = connection.promise();

    const con: PoolConnection = await promiseCon.getConnection();

    await con.beginTransaction();

    try{
        const stm = await con.prepare("SELECT * from discordusers where userID = ?");
        const result: [(
            | RowDataPacket[][]
            | RowDataPacket[]
            | OkPacket
            | OkPacket[]
            | ResultSetHeader
            ),
            FieldPacket[],
        ]  = await stm.execute([userID]);
        
        if(!(result[0] instanceof Array)) throw Error("??? somehow it's not an array");

        // if doesn't exist
        if(result[0].length==0){
            const stm2 = await con.prepare("insert into discordusers (userID) VALUES (?)");
            await stm2.execute([userID]);
            await stm2.close();
        }
        await stm.close();
    }
    catch(err){
        console.log("error, ensureThatGuildDoExist", err);
        await con.rollback;
        return;
    }

    await con.commit();
    await con.destroy();
}

async function ensureThatGuildDoExistInDatabase(connection: Pool, guildID: string): Promise<void> {
    // create connections
    const promiseCon: PoolProm = connection.promise();

    const con: PoolConnection = await promiseCon.getConnection();

    await con.beginTransaction();

    try{
        const stm = await con.prepare("SELECT * from discordguilds where guildID = ?");
        const result: [(
            | RowDataPacket[][]
            | RowDataPacket[]
            | OkPacket
            | OkPacket[]
            | ResultSetHeader
            ),
            FieldPacket[],
        ]  = await stm.execute([guildID]);
        
        if(!(result[0] instanceof Array)) throw Error("??? somehow it's not an array");

        // if doesn't exist
        if(result[0].length==0){
            const stm2 = await con.prepare("insert into discordGUILDS (guildID) VALUES (?)");
            await stm2.execute([guildID]);
            await stm2.close();
        }
        await stm.close();
    }
    catch(err){
        console.log("error, ensureThatGuildDoExist", err);
        await con.rollback;
        return;
    }

    await con.commit();
    await con.destroy();
}


export {ensureThatAllTablesDoExist, getConnection, ensureThatGuildDoExistInDatabase, ensureThatUserDoExistInDatabase, ensureThatUserInGuildDoExistInDatabase, addUserXP, getUserInfoInGuild}
// export type {guildData, channelData}