const { readDb, writeDb } = require("./repository");

const generateId = async () => {
  const dbJSON = await readDb();
  if (dbJSON.length > 0) {
    const idList = dbJSON.map((obj) => obj.id).sort();
    const lastId = Number(idList.slice(-1));
    return lastId + 1;
  } else {
    return 1;
  }
};

const sortObjs = (obj1, obj2) => {
  if (obj1.name > obj2.name) {
    return 1;
  } else if (obj1.name < obj2.name) {
    return -1;
  } else {
    return 0;
  }
};

const getObjectById = (db, objId) => {
  const objIdNumber = Number(objId);
  const object = db.find((obj) => obj.id === objIdNumber);
  return object;
};

const getGenresFromPublisher = (publisher) => {
  const genres = publisher.games.map((obj) => Object.keys(obj)[0]);
  return genres;
};

const getGamesFromPublisher = (publisher) => {
  const games = []
  for (const genre of publisher.games) {
    for (const game of Object.values(genre)) {
      games.push(...game)
    }
  }
  return games
};

const updateObject = async (
  name,
  foundation,
  headquarters,
  logo,
  games,
  db,
  object
) => {
  if (object !== undefined) {
    db.forEach((publisher) => {
      if (publisher.id === object.id) {
        publisher.name = name === undefined ? object.name : name;
        publisher.foundation =
          foundation === undefined ? object.foundation : foundation;
        publisher.headquarters =
          headquarters === undefined ? object.headquarters : headquarters;
        publisher.logo = logo === undefined ? object.logo : logo;
        publisher.games =
          games === undefined ? [...games, ...object.games] : games;
      }
    });
    await writeDb(db);
    return true;
  } else {
    return false;
  }
};

const processGet = async (limit, name, sortBy) => {
  const dbJSON = await readDb();
  let dbJSONMod = undefined;

  if (limit !== undefined && !isNaN(Number(limit))) {
    dbJSONMod = dbJSON.slice(0, limit);
  }

  if (sortBy === "name") {
    if (dbJSONMod) {
      dbJSONMod = dbJSONMod.sort(sortObjs);
    } else {
      dbJSONMod = dbJSON.sort(sortObjs);
    }
  }

  if (name !== undefined) {
    const nameToSearch = name.toLowerCase();
    if (dbJSONMod) {
      const objFound = dbJSONMod.find(
        (obj) => obj.name.toLowerCase() === nameToSearch
      );
      dbJSONMod = objFound;
    } else {
      const objFound = dbJSON.find(
        (obj) => obj.name.toLowerCase() === nameToSearch
      );
      dbJSONMod = objFound;
    }
  }

  if (dbJSONMod !== undefined) {
    return dbJSONMod;
  } else {
    return dbJSON;
  }
};

const processGetById = async (objId) => {
  const dbJSON = await readDb();
  const object = getObjectById(dbJSON, objId);
  return object;
};

const processGetGenresFromPublisher = async (objId) => {
  const dbJSON = await readDb();
  const object = getObjectById(dbJSON, objId);
  return getGenresFromPublisher(object);
};

const processGetGamesByGenresFromPublisher = async (objId) => {
  const dbJSON = await readDb();
  const object = getObjectById(dbJSON, objId);
  return object.games;
};

const processGetGamesFromPublisher = async (objId) => {
  const dbJSON = await readDb();
  const object = getObjectById(dbJSON, objId);
  return getGamesFromPublisher(object);
};

const processPost = async (newRegister) => {
  const dbJSON = await readDb();
  newRegister.id = await generateId();
  dbJSON.push(newRegister);
  await writeDb(dbJSON);
};

const processPut = async (
  name,
  foundation,
  headquarters,
  logo,
  games,
  publisherId
) => {
  const dbJSON = await readDb();
  const object = getObjectById(dbJSON, publisherId);
  const result = updateObject(
    name,
    foundation,
    headquarters,
    logo,
    games,
    dbJSON,
    object
  );
  return result;
};

const processDelete = async (objId) => {
  const dbJSON = await readDb();
  const object = getObjectById(dbJSON, objId);
  if (object !== undefined) {
    dbJSON.splice(dbJSON.indexOf(object), 1);
    await writeDb(dbJSON);
    return { success: true, object };
  } else {
    return { success: false };
  }
};

module.exports = {
  processGet,
  processGetById,
  processGetGenresFromPublisher,
  processGetGamesByGenresFromPublisher,
  processGetGamesFromPublisher,
  processPost,
  processPut,
  processDelete,
};
