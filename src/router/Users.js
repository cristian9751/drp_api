const express = require('express')
const {singUpUser, getUser, getUsers} = require("../controller/User");

const router = express.Router

router.get('/:id', getUser)

router.get('/', getUsers)

router.post('/register', singUpUser)

module.exports = router