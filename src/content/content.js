import $ from 'jquery'
import GithubPullCommit from './GithubPullCommits'
import { getOptions } from '../utils'

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
    .on('keydown', (event) => {
      const handleKey = keyActions[event.key]
      if (app.isOpen() && handleKey) {
        event.preventDefault()
        handleKey()
      } else {
        app.close()
      }
    })
    .on('keyup', (event) => {
      if (app.canOpen(event)) {
        app.open(event.currentTarget)
      }
    })
})
