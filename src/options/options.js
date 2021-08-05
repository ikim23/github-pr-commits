import { getOptions, setOptions } from '../utils'

window.addEventListener('DOMContentLoaded', () => {
  const trigger = document.querySelector('#trigger')
  const token = document.querySelector('#token')
  const success = document.querySelector('.success')

  getOptions((options) => {
    if (options.trigger) {
      trigger.value = options.trigger
    }
    if (options.token) {
      token.value = options.token
    }
  })

  const resetSuccess = () => {
    success.classList.remove('on')
  }

  trigger.addEventListener('input', resetSuccess)
  token.addEventListener('input', resetSuccess)

  document.querySelector('.submit').addEventListener('click', () => {
    if (trigger.validity.patternMismatch) {
      trigger.setCustomValidity('Field cannot contain spaces.')
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

    success.classList.add('on')
  })
})
