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

async function getOneAnimalByName(name) {
  const data = await db.query("SELECT * FROM animals WHERE name = $1", [name]);
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

//GET get-all-mammals
async function getAllMammals() {
  const data = await db.query(
    "SELECT * FROM animals WHERE category = 'mammal'"
  );
  return data.rows;
}

// get-anaimal-by-catergory
async function getAnimalsByCategory(category) {
  const data = await db.query("SELECT * FROM animals WHERE category = $1", [
    category,
  ]);
  return data.rows;
}

// 5. deleteOneAnimal(id)
async function deleteOneAnimalByName(animalName) {
  const data = await db.query("DELETE FROM animals WHERE name = $1", [
    animalName,
  ]);
  return data.rows[0];
}

// 6. addOneAnimal(name, category, can_fly, lives_in)
async function addOneAnimal(name, category, can_fly, lives_in) {
  await db.query(
    "INSERT INTO animals (name, category, can_fly, lives_in) VALUES ($1, $2, $3, $4)",
    [name, category, can_fly, lives_in]
  );
}

// 7. updateOneAnimalName(id, newName)
async function updateOneAnimalName(id, newName) {
  await db.query("UPDATE animals SET name = $1 WHERE id = $2", [newName, id]);
}

// 8. updateOneAnimalCategory(id, newCategory)
async function updateOneAnimalCategory(id, newCategory) {
  const updatedAnimalId = await db.query(
    "UPDATE animals SET category = $1 WHERE id = $2 RETURNING id",
    [newCategory, id]
  );
  return updatedAnimalId.rows[0];
}
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

// GET get-all-mammals
app.get("/get-all-mammals", async (req, res) => {
  const mammals = await getAllMammals();
  res.json(mammals);
});

// GET get-animals-by-category/:category
app.get("/get-animals-by-category/:category", async (req, res) => {
  const category = req.params.category;
  const animals = await getAnimalsByCategory(category);
  res.json(animals);
});

// ---------------------------------
// Post endpoints
// ---------------------------------

// 5. POST /delete-one-animal/:id
app.post("/delete-one-animal/:name", async (req, res) => {
  const deleteOneAnimal = req.params.name;
  await deleteOneAnimalByName(deleteOneAnimal);
  res.send(`Success! ${deleteOneAnimal} was deleted!`);
});
// 6. POST /add-one-animal
app.post("/add-one-animal", async (req, res) => {
  const { name, category, can_fly, lives_in } = req.body;
  await addOneAnimal(name, category, can_fly, lives_in);
  res.send(`Sucess! Animal was added.`);
});
// 7. POST /update-one-animal-name

app.post("/update-one-animal-name", async (req, res) => {
  const { id, newName } = req.body;
  await updateOneAnimalName(id, newName);
  res.send(`Success! The animal's name was updated.`);
});

app.post("/update-one-animal-category", async (req, res) => {
  try {
    const { id, newCategory } = req.body;
    if (!newCategory || !id) {
      return res.status(400).send("Error: Missing required fields");
    }
    const updatedId = await updateOneAnimalCategory(id, newCategory);
    // console.log(updatedId);
    if (!updatedId) {
      return res.status(400).send("Error: 404 animal not found!");
    } else {
      return res.send("Success! The animal's category was updated.");
    }

    res.send("Success! The animal's category was updated.");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
