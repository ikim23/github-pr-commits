import $ from 'jquery'
import _ from 'lodash'
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
      const { value, selectionEnd } = event.target
      const valueBeforeCarret = value.substr(0, selectionEnd)

      if (hasCommitKey(valueBeforeCarret)) {
        $(event.currentTarget)
          .parents('.write-content')
          .first()
          .append(
            `<ul
              role="listbox"
              id="commit-list"
              class="suggester-container suggester suggestions list-style-none position-absolute"
            >
              ${commits
                .map(
                  (commit, index) =>
                    `<li
                      role="option"
                      class="markdown-tile"
                      data-value="${commit.sha}"
                      aria-selected="${index == 0}"
                    >
                      <small>${commit.sha}</small>
                      ${commit.message}
                    </li>`
                )
                .join('')}
            </ul>`
          )
      } else {
        $('#commit-list').remove()
      }
    })
})

async function getPullCommits() {
  const pullParams = parsePullUrl()
  if (!pullParams) {
    return []
  }

  const { status, data } = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/commits', {
    ...pullParams,
    per_page: 100,
  })

  if (status != 200) {
    return []
  }

  const commits = data.map(({ sha, commit }) => ({
    sha: sha.substr(0, 7),
    message: commit.message,
    date: commit.author.date,
  }))

  return _.orderBy(commits, 'date', ['desc'])
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
