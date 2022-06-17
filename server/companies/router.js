const express = require('express')
const fs = require('fs/promises')
const companiesRouter = express.Router()

const db =  './data.json'

const readDb = async () => {
    const dbJSON = await fs.readFile(db)    
    const jsonParsed = JSON.parse(dbJSON)
    return jsonParsed
}

companiesRouter.get('/', (req, res) => {
    const dbJSON = await readDb()    
    res.json(dbJSON);
})

companiesRouter.post('/', (req, res) => {
    const companiesDb = await readDb()    
    const id = Math.random()
    const newRegister = req.body
    newRegister.id = id    
    companiesDb.push(newRegister)
    await fs.writeFile(db, JSON.stringify(companiesDb))
    res.status(201).json(newRegister)
})

companiesRouter.put('/:companyId', (req, res) => {
    const companiesDb = await readDb()
    const {name} = req.body
    const {companyId} = req.params
    const companyIdNumber = Number(companyId)

    if(!isNaN(companyIdNumber)) {
        companiesDb.forEach(company => {
            if (company.id === companyIdNumber) {
                company.name = name
            }
        })        
        await fs.writeFile(db, JSON.stringify(companiesDb))
        res.status(200).send(`Atualizado!`)
    } else {
        res.status(400).send('Id inválido!')
    }
})

companiesRouter.delete('/:companyId', (req, res) => {
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