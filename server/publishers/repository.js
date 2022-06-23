const fs = require('fs/promises')
const basePathIdx = __dirname.lastIndexOf('publishers');
const cutDir = __dirname.slice(0,basePathIdx);
const dataPath = cutDir + '/db.json';

const readDb = async () => {
    const dbJSON = await fs.readFile(dataPath)    
    const jsonParsed = JSON.parse(dbJSON)
    return jsonParsed
}

const writeDb = async (db) => {
    await fs.writeFile(dataPath, JSON.stringify(db))    
}

module.exports = {
    readDb,
    writeDb
}