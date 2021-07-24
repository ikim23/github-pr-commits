import $ from 'jquery'
import { getOptions, setOptions } from './storage'

$(() => {
  const trigger = $('#trigger')
  const token = $('#token')

  getOptions((options) => {
    if (options.trigger) {
      trigger.val(options.trigger)
    }
    if (options.token) {
      token.val(options.token)
    }
  })

  $('#options').on('submit', (event) => {
    event.preventDefault()

    setOptions({
      trigger: trigger.val(),
      token: token.val(),
    })
  })
})
