const { TYPES } = require('../util/token-types')
const { lint: lintEmailFragmentToken } = require('./email-fragment')
const { lint: lintUserInputToken } = require('./user-input')

const TOKEN_VALIDATORS = {
  'email-fragment': lintEmailFragmentToken,
  'user-input': lintUserInputToken,
}

const lintVeevaTokens = (veevaTokens) => {
  const logs = []

  veevaTokens.forEach((token) => {
    if (TOKEN_VALIDATORS[token.type]) {
      const validToken = TOKEN_VALIDATORS[token.type](token)
      if (validToken.grade) logs.push(validToken)
    }
  })

  return logs
}

module.exports = {
  lintVeevaTokens,
}
