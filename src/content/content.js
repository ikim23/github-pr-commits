import _ from 'lodash'
import GithubPullCommit from './GithubPullCommits'
import { addLocationChangeListener, getOptions, addOptionsChangeListener } from '../utils'

const COMMENT_FORM_CLASS = 'comment-form-textarea'

window.addEventListener('DOMContentLoaded', () => {
  let app = null
  const initialize = (options) => {
    app = GithubPullCommit(options)
    app.fetchCommits()
  }
  const fetchCommits = () => {
    app.fetchCommits()
  }

  getOptions(initialize)
  addOptionsChangeListener(initialize)

  window.addEventListener('focus', fetchCommits)
  addLocationChangeListener(fetchCommits)

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
