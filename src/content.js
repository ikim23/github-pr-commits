import { Octokit } from "octokit";

const URL_PATTERN = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/;

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM is ready!");

  // https://github.com/octokit/auth-token.js
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const params = parseUrl();
  const { data } = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits",
    params
  );

  const commits = data.map(({ sha, commit }) => ({
    sha,
    message: commit.message,
    date: commit.author.date,
  }));

  console.log(data);
  console.log(commits);
});

function parseUrl() {
  const [, owner, repo, pull_number] = window.location.href.match(URL_PATTERN);
  return { owner, repo, pull_number };
}
