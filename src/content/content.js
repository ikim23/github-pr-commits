import _ from 'lodash'
import GithubPullCommit from './GithubPullCommits'
import { getOptions, addOptionsChangeListener } from '../utils'

const COMMENT_FORM_CLASS = 'comment-form-textarea'

/**
 * Fetch commits on:
 *  - window focus
 *  - location change
 *  - new commit in timeline
 */
function addPullRequestPageListener(listener) {
  let prevHref = null
  let commitCount = 0

  const observer = new MutationObserver(() => {
    if (prevHref != document.location.href) {
      prevHref = document.location.href
      listener()
    } else {
      const currentCommitCount = document.querySelectorAll('.js-commit').length
      if (commitCount < currentCommitCount) {
        commitCount = currentCommitCount
        listener()
      }
    }
  })

  observer.observe(document.querySelector('body'), { childList: true, subtree: true })

  window.addEventListener('focus', listener)
}

window.addEventListener('DOMContentLoaded', () => {
  let app = null
  const fetchCommits = _.debounce(
    () => {
      app.fetchCommits()
    },
    300,
    { leading: true, trailing: false }
  )
  const initialize = (options) => {
    app = GithubPullCommit(options)
    fetchCommits()
  }

  getOptions(initialize)
  addOptionsChangeListener(initialize)
  addPullRequestPageListener(fetchCommits)

  const keyActions = {
    Enter: () => app.enterCommit(),
    Escape: () => app.close(),
    ArrowUp: () => app.selectPreviousCommit(),
    ArrowDown: () => app.selectNextCommit(),
  }

  window.addEventListener('keyup', (event) => {
    if (event.target.classList.contains(COMMENT_FORM_CLASS) && app.canOpen(event)) {
      app.open(event.target)
    }
  })

  window.addEventListener('keydown', (event) => {
    if (event.target.classList.contains(COMMENT_FORM_CLASS)) {
      if (app.isOpen()) {
        const handleKey = keyActions[event.key]
        if (handleKey) {
          event.preventDefault()
          handleKey()
        } else {
          app.close()
        }
      }
    }
  })

  window.addEventListener('click', () => {
    app.close()
  })
})
