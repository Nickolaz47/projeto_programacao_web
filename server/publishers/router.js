const express = require('express')
const fs = require('fs/promises')
const publishersRouter = express.Router()
const db = './server/publishers/data.json'

const readDb = async () => {
    const dbJSON = await fs.readFile(db)    
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

const sortObjs = (obj1, obj2) => {
    if (obj1.name > obj2.name) {
      return 1
    } else if (obj1.name < obj2.name) {
      return -1
    } else {
      return 0
    }
  }

publishersRouter.get('/', async (req, res) => {
    const dbJSON = await readDb()
    const { limit, name, sortBy } = req.query
    let dbJSONMod = undefined
    if (limit !== undefined && !isNaN(Number(limit))) {
        dbJSONMod = dbJSON.slice(0, limit)
    }
    
    if (sortBy === 'name') {
        if (dbJSONMod) {
            dbJSONMod = dbJSONMod.sort(sortObjs)            
        } else {
            dbJSONMod = dbJSON.sort(sortObjs)            
        } 
    }

    if (name !== undefined) {
        const nameToSearch = name.toLowerCase()
        if (dbJSONMod) {
            const objFound = dbJSONMod.find((obj) => obj.name.toLowerCase() === nameToSearch)
            dbJSONMod = objFound
        } else {
            const objFound = dbJSON.find((obj) => obj.name.toLowerCase() === nameToSearch)
            dbJSONMod = objFound
        }      
    }

    if(dbJSONMod !== undefined) {
        res.json(dbJSONMod)
    } else {
        res.json(dbJSON)
    }
})

publishersRouter.post('/', async (req, res) => {
    const publishersDb = await readDb()        
    const newRegister = req.body    
    newRegister.id = await generateId()    
    publishersDb.push(newRegister)
    await fs.writeFile(db, JSON.stringify(publishersDb))
    res.status(201).json(newRegister)
})

publishersRouter.put('/:companyId', async (req, res) => {
    const publishersDb = await readDb()
    const {name, foundation, headquarters, logo, games} = req.body
    const {companyId} = req.params
    const companyIdNumber = Number(companyId)
    const companyToUpdate = publishersDb.find(
        company => company.id === companyIdNumber
    )
    
    if(companyToUpdate !== undefined) {        
        publishersDb.forEach(company => {
            if (company.id === companyIdNumber) {
                company.name = name === undefined ? companyToUpdate.name : name
                company.foundation = foundation === undefined ? companyToUpdate.foundation : foundation
                company.headquarters = headquarters === undefined ? companyToUpdate.headquarters : headquarters
                company.logo = logo === undefined ? companyToUpdate.logo : logo
                company.games = games === undefined ? [...games, ...companyToUpdate.games] : games
            }
        })
        await fs.writeFile(db, JSON.stringify(publishersDb))
        res.status(200).send(`Atualizado!`)
    } else {
        res.status(400).send('Id inválido!')
    }
})

publishersRouter.delete('/:companyId', async (req, res) => {
    const publishersDb = await readDb()
    const {companyId} = req.params
    const companyIdNumber = Number(companyId)    
    const companyToDelete = publishersDb.find(
        company => company.id === companyIdNumber
    )

    if(companyToDelete !== undefined) {       
        publishersDb.splice(publishersDb.indexOf(companyToDelete), 1)
        await fs.writeFile(db, JSON.stringify(publishersDb))        
        res.status(200).send(companyToDelete)
    } else {
        res.status(400).send('Id inválido!')
    }
})

module.exports = publishersRouter