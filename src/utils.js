function isDev() {
  return process.env.NODE_ENV == 'development'
}

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
      optionsWithDefaults.token = optionsWithDefaults.token ?? process.env.GITHUB_TOKEN

      console.log('Loaded options:', optionsWithDefaults)
    }

    callback(optionsWithDefaults)
  })
}
