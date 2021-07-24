import { isDev } from './utils'

export function setOptions({ trigger, token }) {
  chrome.storage.local.set({ trigger, token })
}

export function getOptions(callback) {
  chrome.storage.local.get(['trigger', 'token'], (options) => {
    if (isDev()) {
      console.log('Loaded options:', options)
    }
    callback(options)
  })
}
