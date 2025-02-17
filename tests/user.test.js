const server = require('../app')
const request = require('supertest')
const sequelize = require('../database/connection')


beforeAll(async () => {
    await sequelize.sync({force:true})
})

afterAll(async () => {
    await sequelize.close(); // Fecha a conexão após os testes
   
    
    server.close()
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

    it("Validação caso o usuario exista", async () => {
        const response = await request(server)
        .post('/verifyUser')
        .send({
            email: "joao@email.com",
            senha: "123456"
        })

        expect(response.status).toBe(200)
    })

    it("Atualizando dados do usuario", async () => {
        const response = await request(server)
        .put('/updateProfile')
        .send({
            nome : "Marcel",
            currentEmail : "joao@email.com",
            email : "joao@gmail.com",
            senha : "123456",
            telefone : "11946287961"
        })

        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Usuario encontrado")
    })
})