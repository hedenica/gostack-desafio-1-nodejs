const express = require("express");
const { uuid, isUuid } = require("uuidv4");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepoId(request, response, next) {
  const { id } = request.params;
  
  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID.' });
  }

  return next();
}

app.use('/repositories/:id', validateRepoId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  
  const repository = {
    id:uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repository => repository.id === id);

  if (repoIndex < 0 ) {
    return response.status(400).json({ error: '👎 No repository found with this ID' });
  }

  const repository = {
    id: repositories[repoIndex].id, 
    title, 
    url, 
    techs,
    likes: repositories[repoIndex].likes,
  };

  repositories[repoIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repository => repository.id === id);

  if (repoIndex < 0 ) {
    return response.status(400).json({ message: '👎 No repository found with this ID' });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repository => repository.id === id);

  const repository = repositories[repoIndex];
  repository.likes = repository.likes + 1

  repositories[repoIndex] = repository;

  return response.json(repository);

});

module.exports = app;
