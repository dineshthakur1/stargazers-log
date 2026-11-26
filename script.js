const repositoryList = document.querySelector("#repository-list");
const statusMessage = document.querySelector("#status");

function renderRepositories(repositories) {
  repositoryList.replaceChildren();

  for (const repository of repositories) {
    const item = document.createElement("li");
    item.className = "repository";

    const heading = document.createElement("h2");
    const link = document.createElement("a");
    link.href = repository.url;
    link.textContent = repository.name;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    heading.append(link);

    const description = document.createElement("p");
    description.textContent = repository.description;

    const starredAt = document.createElement("time");
    starredAt.dateTime = repository.starredAt;
    starredAt.textContent = `Starred on ${new Date(`${repository.starredAt}T00:00:00`).toLocaleDateString()}`;

    item.append(heading, description, starredAt);
    repositoryList.append(item);
  }

  statusMessage.textContent = repositories.length
    ? `${repositories.length} starred repositories`
    : "No starred repositories yet.";
}

async function loadRepositories() {
  try {
    const response = await fetch("./events.json");
    if (!response.ok) {
      throw new Error(`Could not load repository data (${response.status}).`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a list.");
    }
    renderRepositories(repositories);
  } catch (error) {
    statusMessage.textContent = "Starred repositories could not be loaded.";
    console.error(error);
  }
}

loadRepositories();
