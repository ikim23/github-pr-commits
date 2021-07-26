import _ from 'lodash'
import escapeRegex from 'escape-string-regexp'
import { position } from 'caret-pos'
import { Octokit } from '@octokit/core'
import { getParent } from '../utils'

const PULL_URL_PATTERN = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)*/
const COMMIT_LIST_ID = 'gh-pull-commits'

function parsePullUrl() {
  const match = window.location.href.match(PULL_URL_PATTERN)
  if (!match) {
    return null
  }

  const [, owner, repo, pull_number] = match

  return { owner, repo, pull_number }
}

export default function GithubPullCommit({ trigger, token }) {
  const octokit = new Octokit(token ? { auth: token } : undefined)
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

  function canOpen({ key, target: { value, selectionEnd: carret } }) {
    return (
      key == trigger.substr(-1) && new RegExp(`(^|\\s)${escapeRegex(trigger)}\\s?$`).test(value.substr(0, carret + 1))
    )
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

    getParent(input, '.write-content').insertAdjacentHTML('beforeend', list)
    _.each(document.querySelectorAll(`#${COMMIT_LIST_ID} > li`), (commit) => {
      commit.addEventListener('click', (event) => {
        const sha = event.target.getAttribute('data-value')
        enterCommit(sha)
      })
    })
  }

  function update() {
    _.each(document.querySelectorAll(`#${COMMIT_LIST_ID} > li`), (commit) => {
      const sha = commit.getAttribute('data-value')
      commit.setAttribute('aria-selected', sha == selectedSha)
    })
  }

  function enterCommit(sha) {
    if (!sha) {
      return
    }

    const { value, selectionEnd: carret } = input

    let newValue = value.substr(0, carret - trigger.length) + sha
    const newCarrent = newValue.length
    newValue += value.substr(carret)

    input.value = newValue
    input.selectionEnd = newCarrent
    input.focus()

    close()
  }

  function selectNextCommit() {
    if (!isOpen()) {
      return
    }

    const nextIndex = selectedSha ? _.findIndex(commits, { sha: selectedSha }) + 1 : 0
    selectedSha = commits[nextIndex]?.sha ?? ''
    update()
  }

  function selectPreviousCommit() {
    if (!isOpen()) {
      return
    }

    const nextIndex = selectedSha ? _.findIndex(commits, { sha: selectedSha }) - 1 : commits.length - 1
    selectedSha = commits[nextIndex]?.sha ?? ''
    update()
  }

  function close() {
    if (!isOpen()) {
      return
    }

    input = null
    document.querySelector(`#${COMMIT_LIST_ID}`).remove()
  }
}
