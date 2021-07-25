import _ from 'lodash'
import GithubPullCommit from './GithubPullCommits'
import { getOptions } from '../utils'

window.addEventListener('DOMContentLoaded', () => {
  let app = null
  const keyActions = {
    Enter: () => app.enterCommit(),
    Escape: () => app.close(),
    ArrowUp: () => app.selectPreviousCommit(),
    ArrowDown: () => app.selectNextCommit(),
  }

  _.each(document.querySelectorAll('.comment-form-textarea'), (form) => {
    form.addEventListener('focus', () => {
      getOptions((options) => {
        app = GithubPullCommit(options)
        app.fetchCommits()
      })
    })
    form.addEventListener('keydown', (event) => {
      const handleKey = keyActions[event.key]
      if (app.isOpen() && handleKey) {
        event.preventDefault()
        handleKey()
      } else {
        app.close()
      }
    })
    form.addEventListener('keyup', (event) => {
      if (app.canOpen(event)) {
        app.open(event.currentTarget)
      }
    })
  })
})
