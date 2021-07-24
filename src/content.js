import $ from 'jquery'
import GithubPullCommit from './GithubPullCommits'
import { getOptions } from './storage'

$(() => {
  let app = null
  const keyActions = {
    Enter: () => app.enterCommit(),
    Escape: () => app.close(),
    ArrowUp: () => app.selectPreviousCommit(),
    ArrowDown: () => app.selectNextCommit(),
  }

  $('.comment-form-textarea')
    .on('focus', () => {
      getOptions((options) => {
        app = GithubPullCommit(options)
        app.fetchCommits()
      })
    })
    .on('input', (event) => {
      if (app.canOpen(event.target)) {
        app.open(event.currentTarget)
      } else {
        app.close()
      }
    })
    .on('keydown', (event) => {
      const handleKey = keyActions[event.key]
      if (handleKey) {
        event.preventDefault()
        handleKey()
      }
    })
})
