const app = require('./app/app')
require('dotenv').config()
app.listen(process.env.APP_PORT)
