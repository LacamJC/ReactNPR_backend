const express = require('express')
const app = express()
const port = process.env.PORT || 3001

const DefaultData = require('./database/Data.json')

const axios = require('axios')
const cors = require('cors')
const bodyParser = require('body-parser')

const path = require('path')
const multer = require('multer')
const upload = multer({dest: path.join(__dirname, 'public/uploads')})
app.use(upload.single('foto'))

const bd_pontos = require('./database/models/bd_pontos.js')
const bd_usuarios = require('./database/models/bd_usuarios.js')


app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))

async function setDatabase(){
    try{
        await bd_pontos.bulkCreate(DefaultData)
        console.log("DEFAULT DATA SUCCESS")
    }
    catch(err)
    {
        console.log("ERRO TO DEFAULT DATA: "+ err)
    }
}

app.get('/', (req,res)=>{
    res.status(200).send('olá')
})

app.post("/cadastrarPonto",upload.single('foto'), async(req,res)=>{
    console.log("CADASTRANDO PONTO")
    const ponto = {
        email: req.body.email,
        instituicao : req.body.instituicao,
        cep : req.body.cep,
        email : req.body.email,
        cidade : req.body.cidade,
        bairro : req.body.bairro,
        // foto : req.file,
        rua : req.body.rua,
        tipo: req.body.tipo
    }

    try{
            bd_pontos.create({
                email_usuario:ponto.email,
                instituicao: ponto.instituicao,
                cep: ponto.cep,
                cidade: ponto.cidade,
                bairro: ponto.bairro,
                rua: ponto.rua, 
                tipo: ponto.tipo
            })
            .then(()=>{
                console.log("Novo ponto criado")
                res.status(201).send({message:"Ponto criado com sucesso"})
            })  
            .catch(err=>{
                console.log("Erro ao cadastra novo ponto: "+err)
                res.send({message:"Erro ao criar ponto"})
            })
    }catch(err){
        console.log(`Erro ao criar novo ponto: ${err}`)
    }
    


    console.log(ponto)
})

app.post('/cadUser', async (req, res) => {
    console.log("Cadastrando usuário");
    const user = {
        nome : req.body.nome,
        email : req.body.email,
        telefone : req.body.telefone,
        senha : req.body.senha
    }

    await bd_usuarios.findOne({where : {email : user.email}})
    .then((usuario)=>{
        if(usuario){
            console.log("EMAIL JA EXISTE")
            res.status(409).send({message:"Email já cadastrado"})
        }else{
            try{
                 bd_usuarios.create({
                    nome: user.nome,
                    email: user.email,
                    telefone: user.telefone,
                    senha: user.senha,
                 // foto: foto
                })
                .then(()=>{
                    console.log("USUARIO CADASTRADO COM SUCESSO")
                    res.status(201).send({message:'Usuario cadastrado com sucesso'})
                })
                .catch(err=>{
                    console.log("Erro ao cadastrar usuario: "+err)
                    res.status(401).send({message:'erro ao cadastrar usuario'})
                })
            }
            catch(erro)
            {
                console.log("Erro ao acessar banco de dados")
            }
        }
    })

    
  })


  app.post('/verifyUser/',async (req,res)=>{
    console.log("Verificando usuario")
    const user = {
        email : req.body.email,
        senha : req.body.senha
    }

    await bd_usuarios.findOne({where : {email : user.email, senha : user.senha}})
    .then(usuario=>{
        if(usuario)
        {
            console.log("### Usuario encontrado")

            const jsonData = JSON.stringify(usuario,null,2)

            res.status(200).send({message:"Usuario encontrado", data : jsonData})

        }else{

            console.log("### Usuario nao encontrado no banco dedados")
            res.status(409).send({message:"Usuario nao encontrado"})
        }
    })
    .catch(err=>{
        console.log("Erro ao realizar busca: "+err)
    })


  })


app.get('/pontos', async (req,res)=>{
    console.log("PEGANDO TODOS OS PONTOS CADASTRADOS")
    try{
        await bd_pontos.findAll({
        attributes: ['id', 'instituicao', 'cep', 'tipo']
        })
        .then((pontos)=>{
            console.log(pontos)

            res.send(JSON.stringify(pontos,null,2))
        })
        .catch(err=>{
            console.log("Erro ao realizar busca:" + err)
            res.send(401)
        })
    }catch(err)
    {
        console.log(err)
        res.send(401)
    }
})

app.get('/ping', (req,res)=>{
    res.sendStatus(200)
})

app.put('/updateProfile', async(req,res)=>{
    
    const userData = {
        nome : req.body.nome,
        currentEmail : req.body.currentEmail,
        email : req.body.email,
        senha : req.body.senha,
        telefone : req.body.telefone
    }

    try{
        await bd_usuarios.update({
            nome : userData.nome,
            email : userData.email,
            senha : userData.senha,
            telefone: userData.telefone
        },{
            where : {
                email : userData.currentEmail
            }
        })
        .then(async (response)=>{
            if(response){
                console.log("Dados alterados com successo")

                await bd_usuarios.findOne({where : {email : userData.email}})
                .then(usuario=>{
                    if(usuario)
                    {
                        console.log("USUARIO ACHADO")
                        const jsonData = JSON.stringify(usuario,null,2)

                        res.status(200).send({message:"Usuario encontrado", data : jsonData})
                    }
                    else{
                        console.log("USUARIO NAO ENCONTRADO")
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
            }else{
                console.log("Erro ao alterar dados")
                res.send({message: "Erro ao alterar dados"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }catch(err)
    {
        console.log(`ERRO TO UPDATE: ${err}`)
    }

    
})

const server = app.listen(port, (req,res)=>{
    console.log(`app listening on port: ${port}`)
    // setTimeout(()=>setDatabase(),2000)
})



app.get('/down', ()=>{

    server.close()

})




module.exports = server