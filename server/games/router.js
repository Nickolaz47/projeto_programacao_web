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
    const { limit, sortBy, name } = req.query;
    const listGamesLimited = games.slice(0,limit);
    const nomesGames = games.map(game => game.name);
    const nomesGamesSorted = nomesGames.sort();
    const gamesSorted = [];

    for (index in games.data) {
        gamesSorted[index] = games.find(game => game.name === nomesGamesSorted[index]);
    }

    if(sortBy) {
        if(sortBy === 'name') {
            return res.json(gamesSorted)
        }
        res.status(400).send('Critério de organização não definido') // É esse mesmo o status code?
    }

    if(limit) {
        if(limit > games.length) {
            return res.status(400).send('Limite inválido')
        }
        return res.json(listGamesLimited)
    }

    if(name) {
        const gameFilteredByName = games.filter(game => game.name === name);
        res.json(gameFilteredByName);
    }
    res.json(games);
});



// console.log([11,2,22,1].sort()) // ver lógica do sort 

gamesRouter.get('/:gameID', async (req,res) => {
    const games = await readDb();
    const { gameID } = req.params;
    const gameIDNumber = Number(gameID);
    
    if (gameIDNumber < 1 || gameIDNumber > games.length) {
        return res.status(404).send('Jogo não encontrado')
    }
    if (Number.isNaN(gameIDNumber)) {
        return res.status(400).send('ID do jogo inválido')
    }

    const gameFiltered = games.filter(game => game.id === gameIDNumber)
    // console.log(gameID);
    res.json(gameFiltered);
});

// Colocar + 2 queries

// gamesRouter.get('/', (req,res) => {
//     const games = await readDb();

//     const {limit} = req.query;
//     const listGamesLimited = games.slice(0,limit);

//     if(limit) {
//         if(limit > games.length) {
//             return res.status(400).send('Limite inválido')
//         }
//         return res.json(listGamesLimited)
//     }
//     res.json(games.data);
// })
// ;

// gamesRouter.post('/')

module.exports = gamesRouter;
