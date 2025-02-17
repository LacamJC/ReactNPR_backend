const server = require('../server')
const request = require('supertest')
const sequelize = require('../database/connection')



beforeAll(async () => {
    await sequelize.sync({force:true})
})

afterAll(async () => {
    await sequelize.close(); // Fecha a conexão após os testes
})


describe("Testando operações via requisição http", () => {
    it("Criar novo usuario", async () => {
        const response = await request(server)
        .post('/cadUser')
        .send({ 
            nome: "João",
            email: "joao@email.com",
            telefone: "11946287961",
            senha: "123456"
        })

        expect(response.status).toBe(201)
    })
})