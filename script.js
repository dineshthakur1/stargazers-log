const repositoryList = document.querySelector("#repository-list");
const statusMessage = document.querySelector("#status");

function isValidRepository(repository) {
  if (!repository || typeof repository !== "object") {
    return false;
  }

  if (
    typeof repository.name !== "string" ||
    typeof repository.description !== "string" ||
    typeof repository.url !== "string" ||
    typeof repository.starredAt !== "string"
  ) {
    return false;
  }

  try {
    const url = new URL(repository.url);

    if (url.protocol !== "https:") {
      return false;
    }
  } catch {
    return false;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(repository.starredAt)) {
    return false;
  }

  const date = new Date(`${repository.starredAt}T00:00:00Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== repository.starredAt
  ) {
    return false;
  }

  return true;
}

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
      throw new Error(
        `Could not load repository data (${response.status}).`
      );
    }

    const repositories = await response.json();

    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a list.");
    }

    const validRepositories = repositories.filter(isValidRepository);

    renderRepositories(validRepositories);

  } catch (error) {
    statusMessage.textContent =
      "Starred repositories could not be loaded.";

    console.error(error);
  }
}
loadRepositories();
