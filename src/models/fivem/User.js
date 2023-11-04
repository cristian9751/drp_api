const { queryDB } = require('./../../database/connection.js')
const { User } = require('./../../controller/User.js')
const SQL = {
    INSERT : "INSERT INTO Users VALUES (?, ?, ?, ?)",
    UPDATE: "UPDATE Users SET discordId = ?  WHERE steamId = ?",
    DELETE: "DELETE FROM Users WHERE steamId = ?",
    SELECT: "SELECT * FROM Users WHERE steamId = ?",
    SELECT_ALL: "SELECT * FROM Users"
}

function manageQueryResponse(queryResponse) {
    const result  = [];
    queryResponse.forEach((fetchUser) => {
        const user = new User(fetchUser.steamId, fetchUser.discordId);
        result.push(user);
    });

    if(result.isEmpty) {
        return false;
    } else {
        return result
    }
}

async function insert(user) {
    if(!user.type === User) return;
    try {
        const result = await queryDB(SQL.INSERT, [user.steamId, user.discordId])
        return result.affectedRows > 0
    } catch (e) {
        throw e;
    }

}

async function update(user) {
    if(!user.type === User) return;
    try {
        const result = await queryDB(SQL.UPDATE, [user.discordId, user.steamId])
        return result.affectedRows > 0
    } catch (e) {
        throw e;
    }
}

async function deleteUser(steamId) {
    try {
        const result = await queryDB(SQL.UPDATE, [steamId])
        return result.affectedRows > 0
    } catch (e) {

    }
}

async function select(steamId) {
    try {
        let result = await queryDB(SQL.SELECT, [steamId])
        result = manageQueryResponse(result)
        if(result) return result[0]
    } catch (e) {
        throw e
    }
}


async function selectAll() {
    try {
        const result = await queryDB(SQL.SELECT_ALL)
        return manageQueryResponse(result)
    } catch (e) {
        throw e
    }
}

module.exports = {
    insert,
    deleteUser,
    update,
    selectAll,
    select
}