require('dotenv').config();

const express = require('express')
const app = express()
const cyclicDB = require('@cyclic.sh/dynamodb')
const db = cyclicDB(process.env.CYCLIC_DB);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Adicionar novos usuários
app.post('/users/:key', async (req, res) => {
  const key = req.params.key;

  const item = await db.collection('users').get(key);

  if(!item){
    await db.collection('users').set(key, req.body);
    res.end('ok');

  }else{
    res.end('Usuário já cadastrado!');
  }
});

// Obter informações de um usuário
app.get('/users/:key', async (req, res) => {
  const key = req.params.key;

  const item = await db.collection('users').get(key);
  
  res.json(item).end();
});

// Insere novos eventos
app.post('/events/:key', async(req, res) => {
  const key = req.params.key;

  const item = await db.collection('events').set(key, req.body);
  
  res.end('ok');
});

// Atualiza eventos
app.put('/events/:key', async(req, res) => {
  const key = req.params.key;

  const item = await db.collection('events').set(key, req.body);
  
  res.end('ok');
});

// Obtem eventos
app.get('/events/:key', async(req, res) => {
  const key = req.params.key;

  const items = await db.collection('events').get(key);
  
  res.json(items).end();
});

// Fluxo de autenticação
app.get('/auth/:key', async (req, res) => {
  const key = req.params.key

  const item = await db.collection('auth').get(key);

  if(item.props.password == req.body.password){
    res.json({authenticated: true});

  }else{
    res.json({authenticated: false});
  }
});

// Insere um novo usuário no fluxo de autenticação
app.post('/auth/:key', async (req, res) => {
  const key = req.params.key;

  const item = await db.collection('auth').get(key);

  if(!item){
    await db.collection('key').set(key, req.body);
    res.end('ok');

  }else{
    res.end('Usuário já cadastrado!');
  }
});

// Catch all handler for all other request.
app.use('*', (req, res) => {
  res.json({ msg: 'no route handler found' }).end();
})

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`index.js listening on ${port}`);
})
