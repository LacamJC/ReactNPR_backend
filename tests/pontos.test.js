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


describe("Testes de criação de pontos", () => {
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

    it("Este usuario cria um novo ponto de coleta", async () =>{
        const response = await request(server)
        .post('/cadastrarPonto')
        .send({
            email_usuario : "joao@email.com",
            instituicao : "Bioservice ambiental",
            cep: "06331150",
            cidade : "São paulo",
            bairro: "Rio ",
            rua : "rua",
            tipo : ["eletronico"],
        })

        expect(response.status).toBe(201)
    })
})