# Github Pull Request Commits

Suggest Pull Request commits white typing

<img src="screenshots/01.png" width="400" alt="showcase" />

---

## Install

[link-chrome]: https://chrome.google.com/webstore/detail/github-pull-request-commi/idejpahjafhmgppnfcpjhekakjgpgmjb 'Version published on Chrome Web Store'
[link-firefox]: https://addons.mozilla.org/en-GB/firefox/addon/github-pull-request-commits/ 'Version published on Mozilla Add-ons'

### Chrome [<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/chrome/chrome.svg" alt="Chrome" width="32" valign="middle">][link-chrome] [<img src="https://img.shields.io/chrome-web-store/v/idejpahjafhmgppnfcpjhekakjgpgmjb.svg?label=%20" valign="middle">][link-chrome]

1. [Add extension to Chrome][link-chrome]
2. Go to extension options `chrome://extensions/?options=idejpahjafhmgppnfcpjhekakjgpgmjb`
3. Add `Personal access token`
4. Save

### Firefox [<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/firefox/firefox.svg" alt="Firefox" width="32" valign="middle">][link-firefox] [<img src="https://img.shields.io/amo/v/github-pull-request-commits.svg?label=%20" valign="middle">][link-firefox]

1. [Add add-on to Firefox][link-firefox]
2. Go to addons `about:addons`
3. Open `Preferences`
4. Add `Personal access token`
5. Save

### [Create Personal access token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token)

1. Open [`Settings` > `Developer Settings` > `Personal access tokens`](https://github.com/settings/tokens)
2. Click `Generate new token`
3. Check `repo` scope
4. Click `Generate token`

---

## Build from source

1. Build extension `npm run build`
2. Load extension:
   - **Chrome**
     - Go to extensions `chrome://extensions/`
     - Toggle `Developer mode`
     - Click `Load unpacked`
     - Select `dist/webext-prod/` folder
   - **Firefox**
     - Build extension `npm run build`
     - Go to add-ons `about:debugging#/runtime/this-firefox`
     - Click `Load Temporary Add-on...`
     - Select `dist/webext-prod/manifest.json`
3. Add `Personal access token` (see [Install](#Install) guide)

---

## License

**[MIT](LICENSE)** Licensed
