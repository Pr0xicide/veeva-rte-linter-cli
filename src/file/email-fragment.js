const { GRADE, createLogMessage } = require('../util/logging')
const { TYPES } = require('../util/token-types')

const validTokenTypes = [TYPES.CONTENT, TYPES.VAULT]

const invalidTokens = [
  '{{EventSession}}',
  '{{EventSpeaker}}',
  '{{requiresReview}}',
  // "{{insertEngageAndZoomJoinURL[Language Code]}}",
  // "{{insertZoomDialInNumbers[Language Code]}}",
]

/**
 * Validates tokens found in the email fragment.
 * @param {Array<object>} tokens array of Veeva tokens found in the source code
 * @returns {Array<object>} array of reported warnings/errors found
 */
const validate = (tokens) => {
  const logs = []

  for (let i = 0; i < tokens.length; i++) {
    const { type, value: token, line } = tokens[i]

    if (!validTokenTypes.includes(type)) {
      logs.push({
        grade: GRADE.ERROR,
        line,
        token,
        message: `Token "${token}" is not supported in email fragments`,
      })
    }
  }

  return logs
}

module.exports = {
  validate,
}
