import { isDev } from './utils'

export function setOptions({ trigger, token }) {
  chrome.storage.local.set({ trigger, token })
}

export function getOptions(callback) {
  chrome.storage.local.get(['trigger', 'token'], (options) => {
    const optionsWithDefaults = {
      ...options,
      trigger: options.trigger ?? 'gc',
    }

    if (isDev()) {
      console.log('Loaded options:', optionsWithDefaults)
    }

    callback(optionsWithDefaults)
  })
}
