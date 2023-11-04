const express = require('express')
const cors = require("cors")
const morgan = require('morgan')
const usersRouter = require('./../router/Users.js')
const app = express()

app.use(cors({
    origin: "*",
    optionsSuccessStatus: 200
}))

app.use(morgan('dev'))

app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.use('/users', usersRouter)

module.exports = app;