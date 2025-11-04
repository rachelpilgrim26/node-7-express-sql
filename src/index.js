// ---------------------------------
// Boilerplate Code to Set Up Server
// ---------------------------------

import express from "express";
import pg from "pg";
import config from "./config.js";

const db = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl: true,
});

const app = express();

app.use(express.json());

const port = 3000;

app.listen(port, () => {
  console.log(`Server is listening on port #${port}`);
});

// ---------------------------------
// Helper Functions
// ---------------------------------

// 1. getAllAnimals()

async function getAllAnimals() {
  const data = await db.query("SELECT * FROM animals");
  return data.rows;
}
// 2. getOneAnimalByName(name)
async function getOneAnimalByName(name) {
  const data = await db.query("SELECT * FROM animals WHERE name = $1", [name]);
  //   console.log(data.rows);
  return data.rows[0];
}

// 3. getOneAnimalById(id)

async function getOneAnimalById(animalId) {
  const data = await db.query("SELECT * FROM animals WHERE id = $1", [
    animalId,
  ]);
  return data.rows[0];
}
// 4. getNewestAnimal()
async function getNewestAnimal() {
  const data = await db.query("SELECT * FROM animals ORDER BY id DESC LIMIT 1");
  return data.rows[0];
}
// 5. deleteOneAnimal(id)

async function deleteOneAnimalByName(animalName) {
  const data = await db.query("DELETE FROM animals WHERE name = $1", [
    animalName,
  ]);
  return data.rows[0];
}

// 6. addOneAnimal(name, category, can_fly, lives_in)

// 7. updateOneAnimalName(id, newName)

// 8. updateOneAnimalCategory(id, newCategory)

// ---------------------------------
// API Endpoints
// ---------------------------------

// 1. GET /get-all-animals
app.get("/get-all-animals", async (req, res) => {
  const animals = await getAllAnimals();
  res.json(animals);
});
// 2. GET /get-one-animal-by-name/:name
app.get("/get-one-animal-by-name/:name", async (req, res) => {
  let name = req.params.name;
  const animal = await getOneAnimalByName(name);
  res.json(animal);
});

// 3. GET /get-one-animal-by-id/:id
app.get("/get-one-animal-by-id/:id", async (req, res) => {
  const name = req.params.id;
  const animal = await getOneAnimalById(name);
  res.json(animal);
});
// 4. GET /get-newest-animal
app.get("/get-newest-animal", async (req, res) => {
  const animal = await getNewestAnimal();
  res.json(animal);
});
// 5. POST /delete-one-animal/:id
app.post("/delete-one-animal/:name", async (req, res) => {
  const deleteOneAnimal = req.params.name;
  await deleteOneAnimalByName(deleteOneAnimal);
  res.send(`Success! ${deleteOneAnimal} was deleted!`);
});
// 6. POST /add-one-animal

// 7. POST /update-one-animal-name

// 8. POST /update-one-animal-category
