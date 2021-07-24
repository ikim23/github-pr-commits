import _ from 'lodash'
import $ from 'jquery'
import escapeRegex from 'escape-string-regexp'
import { position } from 'caret-pos'
import { Octokit } from '@octokit/core'
import { isDev } from './utils'

const PULL_URL_PATTERN = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)*/
const COMMIT_LIST_ID = 'gh-pull-commits'

function createOctokit(token) {
  if (isDev()) {
    return new Octokit({ auth: token ?? process.env.GITHUB_TOKEN })
  }
  return new Octokit(token ? { auth: token } : undefined)
}

function parsePullUrl() {
  const match = window.location.href.match(PULL_URL_PATTERN)
  if (!match) {
    return null
  }

  const [, owner, repo, pull_number] = match

  return { owner, repo, pull_number }
}

export default function GithubPullCommit({ trigger, token }) {
  const octokit = createOctokit(token)
  let input = null
  let commits = []
  let selectedSha = ''

  return {
    fetchCommits,
    canOpen,
    isOpen,
    open,
    enterCommit: () => enterCommit(selectedSha),
    selectNextCommit,
    selectPreviousCommit,
    close,
  }

  function canOpen(inputElement) {
    const { value, selectionEnd: carret } = inputElement

    if (value == trigger) {
      return true
    }

    if (value.length == carret) {
      return new RegExp(`\\s${escapeRegex(trigger)}$`).test(value)
    }

    return new RegExp(`\\s${escapeRegex(trigger)}\\s$`).test(value.substr(0, carret + 1))
  }

  async function fetchCommits() {
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

    commits = _.orderBy(
      _.map(data, ({ sha, commit }) => ({
        sha: sha.substr(0, 7),
        message: commit.message,
        date: commit.author.date,
      })),
      'date',
      ['desc']
    )
  }

  function isOpen() {
    return !!input
  }

  function open(inputElement) {
    if (!commits.length) {
      return
    }

    selectedSha = commits[0].sha

    const { top, left } = position(inputElement)
    const list = `
      <ul
        id="${COMMIT_LIST_ID}"
        role="listbox"
        class="suggester-container suggester suggestions list-style-none position-absolute"
        style="top: ${top}px; left: ${left}px;"
      >
        ${commits
          .map(
            (commit) =>
              `<li
                role="option"
                class="markdown-tile"
                data-value="${commit.sha}"
                aria-selected="${commit.sha == selectedSha}"
              >
                <small>${commit.sha}</small>
                ${commit.message}
              </li>`
          )
          .join('')}
      </ul>`

    input = inputElement

    $(input).parents('.write-content').first().append(list)
    $(`#${COMMIT_LIST_ID} > li`).on('click', (event) => {
      const sha = $(event.target).attr('data-value')
      enterCommit(sha)
    })
  }

  function update() {
    $(`#${COMMIT_LIST_ID} > li`).each((index, li) => {
      const commit = $(li)
      const sha = commit.attr('data-value')
      commit.attr('aria-selected', sha == selectedSha)
    })
  }

  function enterCommit(sha) {
    const { value, selectionEnd: carret } = input

    let newValue = value.substring(0, carret - trigger.length) + sha
    const newCarrent = newValue.length
    newValue += value.substring(carret)

    input.value = newValue
    input.selectionEnd = newCarrent
    input.focus()

    close()
  }

  function selectNextCommit() {
    if (!isOpen()) {
      return
    }

    const selectedIndex = _.findIndex(commits, { sha: selectedSha })

    const nextIndex = selectedIndex + 1
    if (nextIndex < commits.length) {
      selectedSha = commits[nextIndex].sha
      update()
    }
  }

  function selectPreviousCommit() {
    if (!isOpen()) {
      return
    }

    const selectedIndex = _.findIndex(commits, { sha: selectedSha })

    const nextIndex = selectedIndex - 1
    if (nextIndex >= 0) {
      selectedSha = commits[nextIndex].sha
      update()
    }
  }

  function close() {
    input = null
    $(`#${COMMIT_LIST_ID}`).remove()
  }
}
