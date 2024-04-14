import express from "express";

const app = express();
const port = 8000;

const users = {
    users_list: [
      {
        id: "xyz789",
        name: "Charlie",
        job: "Janitor"
      },
      {
        id: "abc123",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "ppp222",
        name: "Mac",
        job: "Professor"
      },
      {
        id: "yat999",
        name: "Dee",
        job: "Aspring actress"
      },
      {
        id: "zap555",
        name: "Dennis",
        job: "Bartender"
      }
    ]
};

const findUserByName = (name) => {
    return users["users_list"].filter(
        (user) => user["name"] === name
    );
};

const findUserById = (id) =>
users["users_list"].find((user) => user["id"] === id);

const findUserByNameJob = (name, job) => {
    return users["users_list"].filter(
        (user) => (user["name"] === name) && (user["job"] === job)
    );
}

const addUser = (user) => {
    users["users_list"].push(user);
    return user;
};

const deleteUser = (userId) => {
    const index = users["users_list"].findIndex(user => user.id === userId);
    if (index !== -1) {
        return users["users_list"].splice(index, 1)[0];
    }
    return null;
}

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/users", (req, res) => {
    const {name, job} = req.query;
    if (name !== undefined && job !== undefined) {
        let result = findUserByNameJob(name, job);
        result = { users_list: result };
        res.send(result);
    } else if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
      res.status(404).send("Resource not found.");
    } else {
      res.send(result);
    }
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd);
    res.send();
});

app.delete("/users/:id", (req, res) => {
    const userId = req.params.id;
    const delUser = deleteUser(userId);
    if (delUser) {
        res.send(delUser)
    } else {
        res.status(404).send("User not found");
    }
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});
