import $ from 'jquery'
import { getOptions, setOptions } from '../utils'

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

  $('.submit').on('click', () => {
    console.log('validate')
    const [triggerElement] = trigger
    if (triggerElement.validity.patternMismatch) {
      triggerElement.setCustomValidity('Field cannot contain white characters.')
    } else {
      triggerElement.setCustomValidity('')
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
