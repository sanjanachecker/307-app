import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userService from "./services/user-service.js";

const app = express();
const port = 8000;

mongoose.connect('mongodb://localhost:27017/users');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get("/users", async (req, res) => {
  const { name, job } = req.query;
  try {
      let result;
      if (name && job) {
          result = await userService.findByNameAndJob(name, job);
      } else if (name) {
          result = await userService.findUserByName(name);
      } else if (job) {
          result = await userService.findUserByJob(job);
      } else {
          result = await userService.getUsers();
      }
      res.json({ users_list: result });
  } catch (error) {
      res.status(500).send(error.message);
  }
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
      const result = await userService.findUserById(id);
      if (result) {
          res.send(result);
      } else {
          res.status(404).send("User not found");
      }
  } catch (error) {
      res.status(500).send(error.message);
  }
});

app.post("/users", async (req, res) => {
  try {
      const addedUser = await userService.addUser(req.body);
      res.status(201).send(addedUser);
  } catch (error) {
      res.status(500).send(error.message);
  }
});

app.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
      const deletedUser = await userService.deleteUserById(userId);
      if (deletedUser) {
          res.status(204).end();
      } else {
          res.status(404).send("User not found");
      }
  } catch (error) {
      res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});