const express = require('express')
const fs = require('fs/promises')
const genresRouter = express.Router()
// const path = require('path');
// const dataPath = path.join(__dirname, 'data.json')

const basePathIdx = __dirname.lastIndexOf('genres');
const cutDir = __dirname.slice(0,basePathIdx);
const dataPath = cutDir + '/db.json';
// console.log(dataPath);

const readDb = async () => {
    const dbJSON = await fs.readFile(dataPath)    
    const jsonParsed = JSON.parse(dbJSON)
    return jsonParsed
}

const generateId = async () => {
    const dbJSON = await readDb()    
    if (dbJSON.length > 0) {
        const idList = dbJSON.map((obj) => obj.id).sort()        
        const lastId = Number(idList.slice(-1))        
        return lastId + 1
    } else {
        return 1
    }        
}

async function removeDuplicates(array){
    finalArray = [];
    array.map(item => 
        {if(!finalArray.includes(item)) {
            finalArray.push(item);
        }
        });
    return finalArray
}

genresRouter.get('/', async (req, res) => {
    const dbJSON = await readDb()
    let genres = [];
    const { limit, sortBy, name } = req.query;
    dbJSON.map(company => 
        {if (company.games.length > 0){
            company.games.map(genre => genres.push(Object.keys(genre)[0]))
        }}
    )
    genres = await removeDuplicates(genres)
    if(sortBy) {
        if(sortBy === 'genre') {
            genres = await genres.sort();
            res.json(genres)
        }
    }else{
        res.json(genres);
    }
})

genresRouter.post('/', async (req, res) => {
    const dbJSON = await readDb();
    const {idCompany, genre} = req.body;
    let successFlag = false
    let new_genre = {};  
    new_genre[genre] = [];
    dbJSON.map(company => {
            if (company.id == idCompany){
                company.games.push(new_genre);
                successFlag = true
            }
        })
    await fs.writeFile(dataPath, JSON.stringify(dbJSON))
    if(successFlag){
        res.status(201).json("[INFO]: New genre added!");
    }else{
        res.status(404).json("[ERRO]: Company not found!")
    }

})

genresRouter.put('/', async (req, res) => {
    const dbJSON = await readDb()
    const {oldGenreName, newGenreName} = req.body
    let successFlag = false
    dbJSON.map(company => {
        company.games.map(genre => {
            if(Object.keys(genre)[0] == oldGenreName){
                new_genre = {}
                new_genre[newGenreName] = genre[oldGenreName]
                company.games.push(new_genre)
                const idx = company.games.indexOf(genre)
                company.games.splice(idx, 1);
                successFlag = true
            }
        })
    })
    await fs.writeFile(dataPath, JSON.stringify(dbJSON))
    if(successFlag){
        res.status(201).json("[INFO]: Genre updated!");
    }else{
        res.status(404).json("[ERROR]: Genre not found!");
    }
})

genresRouter.delete('/', async (req, res) => {
    const dbJSON = await readDb()
    const {idCompany, genreToRemove} = req.body
    let successFlag = false
    dbJSON.map(company => {
        if(company.id == idCompany){
            company.games.map(genre => {
                if(Object.keys(genre)[0] == genreToRemove){
                    const idx = company.games.indexOf(genre)
                    company.games.splice(idx, 1);
                    successFlag = true
                }
            })
        }
    })
    await fs.writeFile(dataPath, JSON.stringify(dbJSON))
    if(successFlag){
        res.status(201).json("[INFO]: Genre removed!");
    }else{
        res.status(404).json("[ERROR]: Genre not found!");
    }
})

module.exports = genresRouter