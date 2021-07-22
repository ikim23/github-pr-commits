import $ from 'jquery'
import { Octokit } from 'octokit'

const URL_PATTERN = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)*/
const COMMIT_KEY = 'cmt'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

$(async () => {
  let commits = []

  $('.comment-form-textarea')
    .on('focus', async () => {
      commits = await getPullCommits()
    })
    .on('input', (event) => {
      const { value } = event.target

      if (hasCommitKey(value)) {
        console.log(commits)
      }
    })
})

async function getPullCommits() {
  const pullParams = parsePullUrl()
  if (!pullParams) {
    return []
  }

  const { data } = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/commits', pullParams)
  console.log(data)

  const commits = data.map(({ sha, commit }) => ({
    sha,
    message: commit.message,
    date: commit.author.date,
  }))

  return commits
}

function parsePullUrl() {
  const match = window.location.href.match(URL_PATTERN)
  if (!match) {
    return null
  }

  const [, owner, repo, pull_number] = match

  return { owner, repo, pull_number }
}

function hasCommitKey(text) {
  return text == COMMIT_KEY || text.substr(-(COMMIT_KEY.length + 1)) == ' ' + COMMIT_KEY
}
