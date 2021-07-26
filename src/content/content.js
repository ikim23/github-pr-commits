import _ from 'lodash'
import GithubPullCommit from './GithubPullCommits'
import { getOptions } from '../utils'

const COMMENT_FORM_CLASS = 'comment-form-textarea'

window.addEventListener('DOMContentLoaded', () => {
  let app = null
  const keyActions = {
    Enter: () => app.enterCommit(),
    Escape: () => app.close(),
    ArrowUp: () => app.selectPreviousCommit(),
    ArrowDown: () => app.selectNextCommit(),
  }

  const initialize = () => {
    getOptions((options) => {
      app = GithubPullCommit(options)
      app.fetchCommits()
    })
  }

  initialize()

  window.addEventListener('focus', initialize)

  window.addEventListener('keyup', (event) => {
    if (event.target.classList.contains(COMMENT_FORM_CLASS) && app.canOpen(event)) {
      app.open(event.target)
    }
  })

  window.addEventListener('keydown', (event) => {
    if (event.target.classList.contains(COMMENT_FORM_CLASS)) {
      const handleKey = keyActions[event.key]
      if (app.isOpen() && handleKey) {
        event.preventDefault()
        handleKey()
      } else {
        app.close()
      }
    }
  })
})
