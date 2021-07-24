import { isDev } from './utils'

export function setOptions({ trigger, token }) {
  chrome.storage.local.set({ trigger, token })
}

export function getOptions(callback) {
  chrome.storage.local.get(['trigger', 'token'], (options) => {
    const optionsWithDefaults = {
      ...options,
      trigger: options.trigger ?? 'cmt',
    }

    if (isDev()) {
      console.log('Loaded options:', optionsWithDefaults)
    }

    callback(optionsWithDefaults)
  })
}
