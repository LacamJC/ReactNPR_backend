
const Sequelize = require('sequelize')
const database = require('../connection')

const bd_usuarios = database.define('bd_usuarios', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    nome: {
        type: Sequelize.STRING, 
        allowNull : false,

    } 
    ,

    email: {
        type: Sequelize.STRING,
        unique : true,
        allowNull : false,
    },

    telefone: {
        type: Sequelize.STRING
        ,
        allowNull : false,
    },

    senha: {
        type: Sequelize.STRING
        ,
        allowNull : false,
    }

    // foto: {
    //     type: Sequelize.STRING
    // },

    // adm: {
    //     type: Sequelize.STRING
    // }

})

 bd_usuarios.sync({force:true})


 
module.exports = bd_usuarios
