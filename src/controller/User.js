const { selectAll, select, insert, deleteUser } = require('./../models/fivem/User.js')
const mek = require('mysql-error-keys')
class User {
    constructor(steamId, discordId) {
        if(steamId.length === 17 && !isNaN(steamId)) {
            this.steamId = steamId
        } else {
            throw new Error("La steamId no es valida")
        }

        if(discordId.length === 18 && !isNaN(discordId)) {
            this.discordId = discordId
        } else {
            throw new Error("La id de discord no es valida")
        }
    }


}

const getUsers = async(req, res) => {
    try {
        const response =  await selectAll()
        req.status(200).json(response)
    } catch (e) {
        res.status(500).json({ error: "Ha ocurrido un error durante la solicitud"})
    }
}


const getUser = async(req, res) => {
    try {
        if(!req.params.steamId) return res.status(500).json({error: "Falta la id de steam"})
        const user = await select(req.params.steamId)
        if(!user) res.status(404).json({ error: "Usuario no encontrado"})
        return res.status(200).json({user})
    } catch (e) {
        return res.status(500).json({ error: "Ha ocurrido un error durante la solicitud"})
    }

}

const singUpUser = async(req, res) => {
    try {
        const { steamId, discordId } = req.body
        const newUser = new User(steamId, discordId)
        const signedUp = await insert(newUser)
        if(signedUp) {
            return res.status(200).json({ newUser})
        } else {
            return res.status(500).json({error: "Ha ocurrido un error al dar de alta el usuario"})
        }
    } catch (e) {
        if(e.response.data.code === mek.ER_DUP_ENTRY) {
            return res.status(409).json({error: "El usuario ya existe"})
        } else {
            return res.status(500).json("Ha ocurrido un error durante la solicitud")
        }
    }
}

const eraseUser = async(req, res) => {
    try {
        const { steamId } = req.body
        const deleted = await deleteUser(steamId)
        if(deleted) {
            return res.status(200)
        } else {
            return res.status(400).json({error: "El usuario a eliminar no existe"})
        }
    } catch (e) {
        return res.status(500).json("Ha ocurrido un error durante la solicitud")
    }
}

module.exports = {
    getUsers,
    getUser,
    singUpUser,
    eraseUser
}