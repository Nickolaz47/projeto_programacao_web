
const express = require('express')
const app = express()
const publishersRouter = require('./publishers/router')
const genresRouter = require('./genres/router')
const gamesRouter = require('./games/router')

app.use(express.json())
app.use('/publishers', publishersRouter)
app.use('/games', gamesRouter)
app.use('/genres', genresRouter)


app.use('*', (req, res) => {
  res.send('Não há mapeamento para essa rota!')
})

const PORT = 8080
app.listen(PORT, () => {
  console.log(`Servidor disponível em http://localhost:${PORT}`)
})