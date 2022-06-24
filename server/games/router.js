const express = require('express');
const gamesRouter = express.Router(); 
const fsPromises = require('fs/promises');
const basePathIdx = __dirname.lastIndexOf('games');
const cutDir = __dirname.slice(0,basePathIdx);
const dataPath = cutDir + '/db.json';

console.clear();

const readDb = async () => {
    const dbJSON = await fsPromises.readFile(dataPath)    
    const jsonParsed = JSON.parse(dbJSON)
    return jsonParsed
};

const generateGamesDb = async () => {
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

    return gamesPrint2;
}

gamesRouter.get('/', async (req,res) => {
    const gamesPrint2 = await generateGamesDb();

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
        res.status(400).send('Critério de organização não definido')
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
    const gamesPrint2 = await generateGamesDb();

    const { gameID } = req.params;
    const gameIDNumber = Number(gameID);
    
    if (gameIDNumber < 1 || gameIDNumber > gamesPrint2.length) {
        return res.status(404).send('Jogo não encontrado')
    }
    if (Number.isNaN(gameIDNumber)) {
        return res.status(400).send('ID do jogo inválido')
    }

    const gameFiltered = gamesPrint2.filter(game => game.id === gameIDNumber);

    res.json(gameFiltered);
});



gamesRouter.post('/:gameID', async (res,req) => {
    const games = await readDb();
    const {gameID} = req.params;
    // const {id, name}  = req.body; 
    // const 
    // const newGame = {
    //     id: `${lastID + 1}`,
    //     name: `${name}`,
    //     developer: `${developer}`,
    //     genre: `${genre}`,
    //     released: `${released}`,
    // }
    console.log(gameID)
    // res.status(201).send(`Jogo adicionado: \n ${newGame}`)
})

module.exports = gamesRouter;
