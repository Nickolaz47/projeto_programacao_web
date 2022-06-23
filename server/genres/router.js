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
    dbJSON.map(company => 
        {if (company.games.length > 0){
            company.games.map(genre => genres.push(Object.keys(genre)[0]))
        }}
    )
    genres = await removeDuplicates(genres)
    res.json(genres);
})

genresRouter.post('/', async (req, res) => {
    const dbJSON = await readDb();
    const {idCompany, genre} = req.body;
    let new_genre = {};  
    new_genre[genre] = [];
    dbJSON.map(company => {
            if (company.id == idCompany){
                company.games.push(new_genre);
            }
        })
    await fs.writeFile(db, JSON.stringify(dbJSON))
    res.status(201).json("OK!");
})

genresRouter.put('/:companyId', async (req, res) => {
    const companiesDb = await readDb()
    const {name, foundation, headquarters, logo, games} = req.body
    const {companyId} = req.params
    const companyIdNumber = Number(companyId)
    const companyToUpdate = companiesDb.find(
        company => company.id === companyIdNumber
    )
    
    if(companyToUpdate !== undefined) {        
        companiesDb.forEach(company => {
            if (company.id === companyIdNumber) {
                company.name = name === undefined ? companyToUpdate.name : name
                company.foundation = foundation === undefined ? companyToUpdate.foundation : foundation
                company.headquarters = headquarters === undefined ? companyToUpdate.headquarters : headquarters
                company.logo = logo === undefined ? companyToUpdate.logo : logo
                company.games = games === undefined ? companyToUpdate.games : games
            }
        })
        await fs.writeFile(db, JSON.stringify(companiesDb))
        res.status(200).send(`Atualizado!`)
    } else {
        res.status(400).send('Id inválido!')
    }
})

genresRouter.delete('/:companyId', async (req, res) => {
    const companiesDb = await readDb()
    const {companyId} = req.params
    const companyIdNumber = Number(companyId)    
    const companyToDelete = companiesDb.find(
        company => company.id === companyIdNumber
    )

    if(companyToDelete !== undefined) {       
        companiesDb.splice(companiesDb.indexOf(companyToDelete), 1)
        await fs.writeFile(db, JSON.stringify(companiesDb))        
        res.status(200).send(companyToDelete)
    } else {
        res.status(400).send('Id inválido!')
    }
})

module.exports = genresRouter