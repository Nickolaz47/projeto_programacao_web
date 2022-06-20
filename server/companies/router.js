const express = require('express')
const fs = require('fs/promises')
const companiesRouter = express.Router()
const db = './server/companies/data.json'

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

companiesRouter.get('/', async (req, res) => {
    const dbJSON = await readDb()    
    res.json(dbJSON);
})

companiesRouter.post('/', async (req, res) => {
    const companiesDb = await readDb()        
    const newRegister = req.body    
    newRegister.id = await generateId()    
    companiesDb.push(newRegister)
    await fs.writeFile(db, JSON.stringify(companiesDb))
    res.status(201).json(newRegister)
})

companiesRouter.put('/:companyId', async (req, res) => {
    const companiesDb = await readDb()
    const {name, foundation, headquarters, logo, games} = req.body
    const {companyId} = req.params
    const companyIdNumber = Number(companyId)

    if(!isNaN(companyIdNumber)) {
        companiesDb.forEach(company => {
            if (company.id === companyIdNumber) {
                company.name = name
                company.foundation = foundation
                company.headquarters = headquarters
                company.logo = logo
                company.games = games
            }
        })        
        await fs.writeFile(db, JSON.stringify(companiesDb))
        res.status(200).send(`Atualizado!`)
    } else {
        res.status(400).send('Id inválido!')
    }
})

companiesRouter.delete('/:companyId', async (req, res) => {
    const companiesDb = await readDb()
    const {companyId} = req.params
    const companyIdNumber = Number(companyId)    
    const companyToDelete = companiesDb.find(
        company => company.id === companyIdNumber
    )

    if(companyToDelete !== undefined) {       
        companiesDb.splice(companiesDb.findIndex(companyToDelete), 1)
        await fs.writeFile(db, JSON.stringify(companiesDb))        
        res.status(200).send(companyToDelete)
    } else {
        res.status(400).send('Id inválido!')
    }
})

module.exports = companiesRouter