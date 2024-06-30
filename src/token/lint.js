const { GRADE } = require('../util/logging')
const { TYPES } = require('../util/token-types')
const { lint: lintContentToken } = require('./content')
const { lint: lintEmailFragmentToken } = require('./email-fragment')
const { lint: lintUserInputToken } = require('./user-input')
const { lint: lintVaultToken } = require('./vault')

const VEEVA_TOKEN_LINTERS = {
  content: lintContentToken,
  'email-fragment': lintEmailFragmentToken,
  'user-input': lintUserInputToken,
  vault: lintVaultToken,
}

const lintVeevaTokens = (veevaTokens) => {
  const logs = []

  veevaTokens.forEach((token) => {
    // If token linter is defined.
    if (VEEVA_TOKEN_LINTERS[token.type]) {
      // Lint Veeva token, and add to log if any issues were reported.
      const lintedToken = VEEVA_TOKEN_LINTERS[token.type](token)

      if (lintedToken.grade !== GRADE.PASS) {
        logs.push(lintedToken)
      }
    }
  })

  return logs
}

module.exports = {
  lintVeevaTokens,
}
