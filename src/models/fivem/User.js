const { queryDB } = require('./../../database/connection.js')

class User {
    constructor(steamId, discordId, whiteList, activeUser ) {
        this.steamId = this.setSteamId(steamId);
        this.discordId = this.setDiscordId(discordId);
        this.whiteList = this.setWhiteList(whiteList);
        this.activeUser = this.setActiveUser(activeUser)
    }

    setSteamId(steamId) {
        if(!steamId) {
            throw new Error("No se encontro la steamId")
        } else if(typeof(steamId) !== "string"|| steamId.length !== 17) {
            throw new Error("El steamId no es valido")
        }

        return steamId
    }

    setDiscordId(discordId) {
        if(!discordId) {
            throw new Error("No se encontro el discordId")
        } else if(typeof discordId !== "string" || discordId.length !== 18) {
            throw new Error("El discordId no es valido")
        }

        return discordId
    }

    setWhiteList(whiteList) {
        if(whiteList === null || whiteList === undefined) {
            throw new Error("No se encontro el parametro whiteList")
        } else if(typeof whiteList !== "boolean") {
            throw new Error("El parametro whitelist no es valido")
        }

        return whiteList;
    }

    setActiveUser(activeUser) {
        console.log(`Set active user : ${activeUser}`)
        if(activeUser === null || activeUser === undefined) {
            throw new Error("No se encontro el parametro activeUser")
        } else if(typeof activeUser !== "boolean") {
            throw new Error("El parametro activeUser no es valido")
        }

        return activeUser;
    }
}

const SQL = {
    INSERT : "INSERT INTO Users VALUES (?, ?, ?, ?)",
    UPDATE: "UPDATE Users SET discordId = ?  WHERE steamId = ?",
    INACTIVE: "UPDATE Users SET activeUser = false WHERE steamId = ?",
    SELECT: "SELECT * FROM Users WHERE steamId = ?",
    SELECT_ALL: "SELECT * FROM Users WHERE activeUser = true",
    SELECT_HISTORIC: "SELECT * FROM Users WHERE activeUser = false"
}

function manageQueryResponse(queryResponse) {
    const result  = [];
    queryResponse.forEach((fetchUser) => {
        let whiteList = fetchUser.whitelist;
        let activeUser = fetchUser.activeUser;
        console.log(activeUser)
        whiteList = whiteList === 1
        activeUser = activeUser === 1
        const user = new User(fetchUser.steamId, fetchUser.discordId, whiteList, activeUser);
        result.push(user);
    });

    if(result.length === 0) {
        return false;
    } else {
        return result
    }
}

async function insert(user) {
    try {
        const result = await queryDB(SQL.INSERT, [user.steamId, user.discordId, user.whiteList, user.activeUser])
        return result.affectedRows > 0
    } catch (e) {
        throw e;
    }

}

async function update(user) {
    try {
        const result = await queryDB(SQL.UPDATE, [user.discordId, user.steamId])
        return result.affectedRows > 0
    } catch (e) {
        throw e;
    }
}

async function deleteUser(steamId) {
    try {
        const result = await queryDB(SQL.INACTIVE, [steamId])
        return result.affectedRows > 0
    } catch (e) {
        throw e;
    }
}

async function select(steamId) {
    try {
        let result = await queryDB(SQL.SELECT, [steamId])
        return manageQueryResponse(result)
    } catch (e) {
        throw e
    }
}


async function selectAll() {
    return selectUsers(SQL.SELECT_ALL)
}

async function selectAllHistoric() {
    return selectUsers(SQL.SELECT_HISTORIC)
}

async function selectUsers(query) {
    try {
        const result = await queryDB(query)
        return manageQueryResponse(result)
    } catch (e) {
        throw e
    }
}

module.exports = {
    User,
    insert,
    deleteUser,
    update,
    selectAll,
    selectAllHistoric,
    select
}