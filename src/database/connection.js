const mysql = require('mysql');
require('dotenv').config()
const db_config = {
    host     : process.env.MYSQL_HOST,
    user     : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE
}


async function doConnection() {
    const connection = mysql.createConnection(db_config);
    return new Promise((resolve, reject) => {
        connection.connect((error) => {
            if(error) {
                throw new Error("There was no connection with the database")
            } else {
                resolve(connection)
            }
        })
    })
}

const queryDB =  async (query, options) => {
    const connection = await doConnection();
    return new Promise((resolve, reject) => {
        connection.query(query, options, (error, result) => {
            if(error) {
                reject(error);
            } else {
                resolve(result)
            }
            connection.end();
        })
    })
}


module.exports = {
    queryDB
}