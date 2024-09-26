const { GRADE } = require('veeva-approved-email-util/lib/linting/grading')
const {
  CATEGORY_TYPES,
} = require('veeva-approved-email-util/lib/tokens/category')

const { lint: lintContentTokens } = require('./content')
const { lint: lintEmailFragmentTokens } = require('./email-fragment')
const { lint: lintUserInputTokens } = require('./user-input')
const { lint: lintVaultTokens } = require('./vault')
const {
  TokenMessage,
  UnknownTokenMessage,
} = require('veeva-approved-email-util/lib/linting/message')

const VEEVA_TOKEN_LINTERS = Object.freeze({
  content: lintContentTokens,
  'email fragment': lintEmailFragmentTokens,
  'user input': lintUserInputTokens,
  vault: lintVaultTokens,
})

/**
 * Lints an array of Veeva tokens from getVeevaTokens and determineTokenCategory.
 *
 * @param {Array<{line:number, category:CATEGORY_TYPES, token:String}>} veevaTokens array tokens to lint
 * @returns {Array<TokenMessage>} array of TokenMessage objects containing info about each token with issues or warnings
 */
const lintVeevaTokens = (veevaTokens) => {
  const logs = []

  veevaTokens.forEach((veevaToken) => {
    const { category, line, token } = veevaToken

    // Report any unknown tokens.
    if (category === CATEGORY_TYPES.UNKNOWN) {
      const msg = new UnknownTokenMessage({
        line,
        token,
      })

      logs.push(msg)
    }

    // If token linter is defined.
    else if (VEEVA_TOKEN_LINTERS[category]) {
      // Lint Veeva token, and add to log if any issues were reported.
      const lintedToken = VEEVA_TOKEN_LINTERS[category](veevaToken)

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
