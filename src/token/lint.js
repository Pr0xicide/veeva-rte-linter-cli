const { TYPES } = require('../util/token-types')
const { validate: validateEmailFragmentToken } = require('./email-fragment')

const TOKEN_VALIDATORS = {
  'email-fragment': validateEmailFragmentToken,
}

const lintVeevaTokens = (veevaTokens) => {
  const logs = []

  veevaTokens.forEach((token) => {
    if (TOKEN_VALIDATORS[token.type]) TOKEN_VALIDATORS[token.type](token)
  })

  return logs
}

module.exports = {
  lintVeevaTokens,
}
