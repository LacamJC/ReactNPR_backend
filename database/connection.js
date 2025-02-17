const Sequelize = require('sequelize')

// const sequelize = new Sequelize('u342643381_database', 'u342643381_root', 'OKn2089x', {
//     dialect : 'mysql', 
//     host: 'srv1782.hstgr.io',
//     port: 3306
// })

const sequelize = new Sequelize(
    process.env.NODE_ENV === "test" ? "sqlite:memory" : "reactnpr",
    process.env.NODE_ENV === "test" ? undefined :"root",
    process.env.NODE_ENV === "test" ? undefined : "",
    {
        dialect : process.env.NODE_ENV === "test" ? "sqlite" : "mysql",
        host : process.env.NODE_ENV === "test" ? undefined : "localhost",
        port: process.env.NODE_ENV === "test" ? undefined : 3306,
        logging: false,
    }
)

module.exports = sequelize