const express = require('express');
const gamesRouter = express.Router(); // será utilizado router depois
const app = express(); // por hora, utilizado para testar com postman
const fsPromises = require('fs/promises');
// const path = require('path');
const basePathIdx = __dirname.lastIndexOf('games');
const cutDir = __dirname.slice(0,basePathIdx);
const dataPath = cutDir + '/db.json';

console.clear();

const readDb = async () => {
    const dbJSON = await fsPromises.readFile(dataPath)    
    const jsonParsed = JSON.parse(dbJSON)
    return jsonParsed
};



gamesRouter.get('/', async (req,res) => {
    console.clear();
    const games = await readDb();
    const gamesPrint = []

    for (index in games) {
        const primeiraCamadaFor = games[index]; 3
        const segundaCamadaFor = primeiraCamadaFor.games;
        for (index in segundaCamadaFor) {
            const terceiraCamadaFor = segundaCamadaFor[index];
            const valuesTerceiraCamada = Object.values(terceiraCamadaFor)
            gamesPrint.push(valuesTerceiraCamada)
        }
    }

    const gamesPrint2 = []

    for (index in gamesPrint) {
        const outraPrimeiraCamada = gamesPrint[index]
        for (index2 in outraPrimeiraCamada) {
            const outraSegundaCamada = gamesPrint[index][index2]
            for (index3 in outraSegundaCamada) {
                gamesPrint2.push(outraSegundaCamada[index3])
            }
        }
    }

    const { limit, sortBy, name } = req.query;
    const listGamesLimited = gamesPrint2.slice(0,limit);
    const nomesGames = gamesPrint2.map(game => game.name);
    const nomesGamesSorted = nomesGames.sort();
    const gamesSorted = [];


    for (index in gamesPrint2) {
        gamesSorted[index] = gamesPrint2.find(game => game.name === nomesGamesSorted[index]);
    }

    if(sortBy) {
        if(sortBy === 'name') {
            return res.json(gamesSorted)
        }
        res.status(400).send('Critério de organização não definido') // É esse mesmo o status code?
    }

    if(limit) {
        if(limit > gamesPrint2.length) {
            return res.status(400).send('Limite inválido')
        }
        return res.json(listGamesLimited)
    }

    if(name) {
        const gameFilteredByName = gamesPrint2.filter(game => game.name === name);
        res.json(gameFilteredByName);
    }

    res.send(gamesPrint2)
});

gamesRouter.get('/:gameID', async (req,res) => {
    const games = await readDb();

    const gamesPrint = []

    for (index in games) {
        const primeiraCamadaFor = games[index]; 3
        const segundaCamadaFor = primeiraCamadaFor.games;
        for (index in segundaCamadaFor) {
            const terceiraCamadaFor = segundaCamadaFor[index];
            const valuesTerceiraCamada = Object.values(terceiraCamadaFor)
            gamesPrint.push(valuesTerceiraCamada)
        }
    }

    const gamesPrint2 = []

    for (index in gamesPrint) {
        const outraPrimeiraCamada = gamesPrint[index]
        for (index2 in outraPrimeiraCamada) {
            const outraSegundaCamada = gamesPrint[index][index2]
            for (index3 in outraSegundaCamada) {
                gamesPrint2.push(outraSegundaCamada[index3])
            }
        }
    }

    const { gameID } = req.params;
    const gameIDNumber = Number(gameID);
    
    if (gameIDNumber < 1 || gameIDNumber > gamesPrint2.length) {
        return res.status(404).send('Jogo não encontrado')
    }
    if (Number.isNaN(gameIDNumber)) {
        return res.status(400).send('ID do jogo inválido')
    }

    const gameFiltered = gamesPrint2.filter(game => game.id === gameIDNumber)
    // console.log(gameID);
    res.json(gameFiltered);
});


gamesRouter.post('/', async (res,req) => {
    const games = await readDb();
    const { name, developer, genre, released } = req.body; // testar requisição no postman
    const lastID = '' // ver qual a lógica do Weatherlly para, então, pegar o último id
    const newGame = {
        id: `${lastID + 1}`,
        name: `${name}`,
        developer: `${developer}`,
        genre: `${genre}`,
        released: `${released}`,
    }
    games.push(newGame)
    res.status(201).send(`Jogo adicionado: \n ${newGame}`)
})

gamesRouter.put('/:gameID')

module.exports = gamesRouter;
