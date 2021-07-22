import { Octokit } from "octokit";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM is ready.");

  const octokit = new Octokit();

  const data = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits",
    {
      owner: "facebook",
      repo: "react",
      pull_number: 1,
    }
  );

  console.log(data);
});
