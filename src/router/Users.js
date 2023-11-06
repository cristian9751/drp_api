const express = require('express')
const {singUpUser, getUsers, eraseUser, singInUser} = require("../controller/UserController");



const router = express.Router()



router.post('/', getUsers)


router.post('/remove', eraseUser)

router.post('/register', singUpUser)

router.post('/signin', singInUser)

module.exports = router