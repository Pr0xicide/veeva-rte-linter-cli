const { GRADE, createLogMessage } = require('../util/logging')
const { TYPES } = require('../util/token-types')

const validTokenTypes = [TYPES.CONTENT]

const invalidTokens = [
  '{{addToCalendar}}',
  '{{EventSession}}',
  '{{EventSpeaker}}',
  '{{requiresReview}}',
  // "{{insertEngageAndZoomJoinURL[Language Code]}}",
  // "{{insertZoomDialInNumbers[Language Code]}}",
]

/**
 * Validates tokens found in the template fragment.
 * @param {Array<object>} tokens array of Veeva tokens found in the source code
 * @returns {Array<object>} array of reported warnings/errors found
 */
const validate = (tokens) => {
  const logs = []

  for (let i = 0; i < tokens.length; i++) {
    const { type, name } = tokens[i]

    if (!validTokenTypes.includes(type)) {
      logs.push(
        createLogMessage(
          GRADE.CRITICAL,
          `Token "${name}" is not supported in template fragments.`
        )
      )
    }
  }

  return logs
}

module.exports = {
  validate,
}
