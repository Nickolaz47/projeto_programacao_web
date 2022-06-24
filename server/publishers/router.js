const express = require("express");
const publishersRouter = express.Router();
const {
  processGet,
  processGetById,
  processGetGenresFromPublisher,
  processGetGamesByGenresFromPublisher,
  processGetGamesFromPublisher,
  processPost,
  processPut,
  processDelete,
} = require("./controller");

publishersRouter.get("/", async (req, res) => {
  const { limit, name, sortBy } = req.query;  
  res.json(await processGet(limit, name, sortBy));
});

publishersRouter.get("/:publisherId", async (req, res) => {  
  const { publisherId } = req.params;
  const publisher = await processGetById(publisherId)
  if (publisher !== undefined) {
    res.send(publisher);
  } else {
    res.status(400).send("Id inválido!");
  }
});

publishersRouter.get("/:publisherId/genres", async (req, res) => {  
  const { publisherId } = req.params;
  const genres = await processGetGenresFromPublisher(publisherId)
  if(genres !== undefined) {
    res.json(genres)
  } else {
    res.status(400).send("Id inválido!");
  }  
});

publishersRouter.get("/:publisherId/genres/games", async (req, res) => {  
  const { publisherId } = req.params;
  const gamesByGenrer = await processGetGamesByGenresFromPublisher(publisherId)
  if(gamesByGenrer !== undefined) {
    res.json(gamesByGenrer)
  } else {
    res.status(400).send("Id inválido!");
  }  
});

publishersRouter.get("/:publisherId/games", async (req, res) => {  
  const { publisherId } = req.params;
  const gamesByGenrer = await processGetGamesFromPublisher(publisherId)
  if(gamesByGenrer !== undefined) {
    res.json(gamesByGenrer)
  } else {
    res.status(400).send("Id inválido!");
  }  
});

publishersRouter.post("/", async (req, res) => {
  const newRegister = req.body;
  await processPost(newRegister);
  res.status(201).json(newRegister);
});

publishersRouter.put("/:publisherId", async (req, res) => {
  const { name, foundation, headquarters, logo, games } = req.body;
  const { publisherId } = req.params;
  const result = await processPut(
    name,
    foundation,
    headquarters,
    logo,
    games,
    publisherId
  );
  if (result) {
    res.status(200).send(`Atualizado!`);
  } else {
    res.status(400).send("Id inválido!");
  }
});

publishersRouter.delete("/:publisherId", async (req, res) => {
  const { publisherId } = req.params;
  const { success, object: publisherDeleted } = await processDelete(
    publisherId
  );
  if (success) {
    res.status(200).send(publisherDeleted);
  } else {
    res.status(400).send("Id inválido!");
  }
});

module.exports = publishersRouter;
