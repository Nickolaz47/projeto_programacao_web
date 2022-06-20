
const express = require('express')
const app = express()
const publishersRouter = require('./publishers/router')

app.use(express.json())

app.use('/publishers', publishersRouter)

app.use('*', (req, res) => {
  res.send('Não há mapeamento para essa rota!')
})

const PORT = 8080
app.listen(PORT, () => {
  console.log(`Servidor disponível em http://localhost:${PORT}`)
})