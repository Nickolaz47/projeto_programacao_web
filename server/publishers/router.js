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

publishersRouter.put('/:publisherId', async (req, res) => {
    const publishersDb = await readDb()
    const {name, foundation, headquarters, logo, games} = req.body
    const {publisherId} = req.params
    const publisherIdNumber = Number(publisherId)
    const publisherToUpdate = publishersDb.find(
        publisher => publisher.id === publisherIdNumber
    )
    
    if(publisherToUpdate !== undefined) {        
        publishersDb.forEach(publisher => {
            if (publisher.id === publisherIdNumber) {
                publisher.name = name === undefined ? publisherToUpdate.name : name
                publisher.foundation = foundation === undefined ? publisherToUpdate.foundation : foundation
                publisher.headquarters = headquarters === undefined ? publisherToUpdate.headquarters : headquarters
                publisher.logo = logo === undefined ? publisherToUpdate.logo : logo
                publisher.games = games === undefined ? [...games, ...publisherToUpdate.games] : games
            }
        })
        await fs.writeFile(db, JSON.stringify(publishersDb))
        res.status(200).send(`Atualizado!`)
    } else {
        res.status(400).send('Id inválido!')
    }
})

publishersRouter.delete('/:publisherId', async (req, res) => {
    const publishersDb = await readDb()
    const {publisherId} = req.params
    const publisherIdNumber = Number(publisherId)    
    const publisherToDelete = publishersDb.find(
        publisher => publisher.id === publisherIdNumber
    )

    if(publisherToDelete !== undefined) {       
        publishersDb.splice(publishersDb.indexOf(publisherToDelete), 1)
        await fs.writeFile(db, JSON.stringify(publishersDb))        
        res.status(200).send(publisherToDelete)
    } else {
        res.status(400).send('Id inválido!')
    }
})

publishersRouter.get('/:publisherId', async (req, res) => {
    const dbJSON = await readDb()
    const {publisherId} = req.params
    const publisherIdNumber = Number(publisherId)    
    const publisher = dbJSON.find(
        publ => publ.id === publisherIdNumber
    )
    if(publisher !== undefined) {               
        res.send(publisher)
    } else {
        res.status(400).send('Id inválido!')
    }
})

module.exports = publishersRouter