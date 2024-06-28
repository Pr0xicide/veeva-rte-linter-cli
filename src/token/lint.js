const { TYPES } = require('../util/token-types')
const { validate: validateEmailFragmentToken } = require('./email-fragment')

const TOKEN_VALIDATORS = {
  'email-fragment': validateEmailFragmentToken,
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
