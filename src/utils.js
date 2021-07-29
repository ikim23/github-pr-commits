function isDev() {
  return process.env.NODE_ENV == 'development'
}

export function getParent(element, parentSelector) {
  let currentElement = element
  while ((currentElement = currentElement.parentNode)) {
    if (currentElement.matches(parentSelector)) {
      return currentElement
    }
  }
  return null
}

export function addLocationChangeListener(listener) {
  let prevHref = null

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      if (prevHref != document.location.href) {
        listener((prevHref = document.location.href))
      }
    })
  })

  observer.observe(document.querySelector('body'), { childList: true, subtree: true })
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

export function addOptionsChangeListener(callback) {
  chrome.storage.onChanged.addListener((_, areaName) => {
    if (areaName == 'local') {
      getOptions(callback)
    }
  })
}
