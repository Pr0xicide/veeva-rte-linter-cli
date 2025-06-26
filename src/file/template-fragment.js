const {
  CATEGORY_TYPES,
} = require('veeva-approved-email-util/lib/tokens/category')

const { FILE_TYPES } = require('../util/cli')
const {
  flagUnsupportedTokenCategories,
  flagUnsupportedTokens,
} = require('../util/flag')

const SUPPORTED_TOKEN_CATEGORIES = [
  CATEGORY_TYPES.CONTENT,
  CATEGORY_TYPES.FUNCTIONALITY,
]
const UNSUPPORTED_TOKENS = [
  '{{addToCalendar',
  '{{EventSession',
  '{{EventSpeaker',
  '{{requiresReview',
  '{{insertEngageAndZoomJoinURL',
  '{{insertZoomDialInNumbers',
]
const fileType = FILE_TYPES.tf

/**
 * Lints Veeva tokens found in template fragment files.
 *
 * @param {Array<Object>} veevaTokens array of Veeva tokens found in the HTML file
 * @returns {Array<{TokenMessage}>} array of TokenMessages to output
 */
const lint = (veevaTokens) => {
  const logs = []

  flagUnsupportedTokenCategories({
    fileType,
    veevaTokens,
    supportedCategories: SUPPORTED_TOKEN_CATEGORIES,
    logArray: logs,
  })

  flagUnsupportedTokens({
    fileType,
    veevaTokens,
    unsupportedTokens: UNSUPPORTED_TOKENS,
    logArray: logs,
  })

  return logs
}

module.exports = {
  lint,
}
