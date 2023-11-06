const { selectAll, select, insert, deleteUser } = require('./../models/fivem/User.js')
const mek = require('mysql-error-keys')
const { User } = require('./../models/fivem/User.js')
const {update} = require("../models/fivem/User");

const getUsers = async(req, res) => {
    try {
        const response =  await selectAll()
        res.status(200).json(response)
    } catch (e) {
       return res.status(500).json({ error: "Ha ocurrido un error durante la solicitud "})
    }
}

const singInUser = async(req, res) => {
    const { steamId } = req.body;
    try {
        const selected = await select(steamId)
        if(selected && selected[0].activeUser) return res.status(200).json(selected[0])
        return res.status(500).json({error: "El usuario no existe"})
    } catch (e) {
        return res.status(500).json({error: e.message})
    }
}

const setUpDiscord = async(req, res) => {
    const { User, discordId } = req.body;
    try {
        User.setDiscordId(discordId)
        const updated = await update(User)
        if(updated) return res.status(200).json({user})
        return res.status(500).json({error: "Ha ocurrido un error con los datos modificados"})
    } catch (e) {
        return res.status(500).json({error: "Se ha producido un error al procesar la solicitud"})
    }
}
const singUpUser = async(req, res) => {
    const { steamId, discordId, whiteList} = req.body
    let newUser = null;
    try {
        newUser = new User(steamId, discordId, whiteList, true)
    } catch (e) {
        return res.status(500).json({error: e.message})
    }
    try {
        const inserted = await insert(newUser)
        if(inserted) {
            return res.status(200).json({newUser})
        } else {
            return res.status(500).json({error: "Ha ocurrido un error al dar de alta el usuario"})
        }
    } catch (e) {
        if(e.code === mek.ER_DUP_ENTRY) {
            return res.status(409).json(({error: "El usuario que se quiere registrar ya existe"}))
        } else {
            return res.status(500).json({error: `Ha ocurrido un error al procesar la solicitud` })
        }
    }
}

const eraseUser = async(req, res) => {
    try {
        const { steamId } = req.body
        if(!steamId) return res.status(500).json({error: "No se encontro el steamId"})
        const deleted = await deleteUser(steamId)
        if(deleted) {
            res.status(200)
        } else {
            return res.status(404).json({error: "El usuario a eliminar no existe"})
        }
    } catch (e) {
        return res.status(500).json({error: "Ha ocurrido un error durante la solicitud"})
    }
}




module.exports = {
    getUsers,
    singInUser,
    singUpUser,
    eraseUser,
    setUpDiscord
}