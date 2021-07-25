import { getOptions, setOptions } from '../utils'

window.addEventListener('DOMContentLoaded', () => {
  const trigger = document.querySelector('#trigger')
  const token = document.querySelector('#token')

  getOptions((options) => {
    if (options.trigger) {
      trigger.value = options.trigger
    }
    if (options.token) {
      token.vallue = options.token
    }
  })

  document.querySelector('.submit').addEventListener('click', () => {
    if (trigger.validity.patternMismatch) {
      trigger.setCustomValidity('Field cannot contain white characters.')
    } else {
      trigger.setCustomValidity('')
    }
  })

  document.querySelector('#options').addEventListener('submit', (event) => {
    event.preventDefault()

    setOptions({
      trigger: trigger.value,
      token: token.value,
    })
  })
})
