const express = require('express');
const gamesRouter = express.Router(); // será utilizado router depois
const app = express(); // por hora, utilizado para testar com postman
const fsPromises = require('fs/promises');
// const path = require('path');

console.clear();

const basePathIdx = __dirname.lastIndexOf('games');
const cutDir = __dirname.slice(0,basePathIdx);
const dbPath = cutDir + '/db.json';

const readDb = async () => {
    const dbJSON = await fsPromises.readFile(dbPath,'utf-8')    
    const jsonParsed = JSON.parse(dbJSON)
    return jsonParsed
};

app.get('/games', async (req,res) => {
    console.clear();
    const games = await readDb();
    const { limit, sortBy, name } = req.query;
    const listGamesLimited = games.data.slice(0,limit);
    const nomesGames = games.data.map(game => game.name);
    const nomesGamesSorted = nomesGames.sort();
    const gamesSorted = [];

    for (index in games.data) {
        gamesSorted[index] = games.data.find(game => game.name === nomesGamesSorted[index]);
    }

    if(sortBy) {
        if(sortBy === 'name') {
            return res.json(gamesSorted)
        }
        res.status(400).send('Critério de organização não definido') // É esse mesmo o status code?
    }

    if(limit) {
        if(limit > games.data.length) {
            return res.status(400).send('Limite inválido')
        }
        return res.json(listGamesLimited)
    }

    if(name) {
        const gameFilteredByName = games.data.filter(game => game.name === name);
        res.json(gameFilteredByName);
    }
    res.json(games.data);
});



// console.log([11,2,22,1].sort()) // ver lógica do sort 

app.get('/games/:gameID', async (req,res) => {
    const games = await readDb();
    const { gameID } = req.params;
    const gameIDNumber = Number(gameID);
    
    if (gameIDNumber < 1 || gameIDNumber > games.data.length) {
        return res.status(404).send('Jogo não encontrado')
    }
    if (Number.isNaN(gameIDNumber)) {
        return res.status(400).send('ID do jogo inválido')
    }

    const gameFiltered = games.data.filter(game => game.id === gameIDNumber)
    // console.log(gameID);
    res.json(gameFiltered);
});

// Colocar + 2 queries

// gamesRouter.get('/games', (req,res) => {
//     const games = await readDb();

//     const {limit} = req.query;
//     const listGamesLimited = games.data.slice(0,limit);

//     if(limit) {
//         if(limit > games.data.length) {
//             return res.status(400).send('Limite inválido')
//         }
//         return res.json(listGamesLimited)
//     }
//     res.json(games.data);
// })
// ;

// gamesRouter.post('/')

app.listen(8080);