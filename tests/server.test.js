const server = require('../app')
const request = require('supertest')

afterEach(async ()=>{
    await request(server)
    .get('/down')
})


describe("Testes de servidor", () => {
    it("Chamada raiz(/) do servidor", async () => {
        const response = await request(server)
        .get('/')

        expect(response.status).toBe(200)
    })

    it("Pingando o servidor", async () => {
        const response = await request(server)
        .get('/ping')

        expect(response.status).toBe(200)
    })
})