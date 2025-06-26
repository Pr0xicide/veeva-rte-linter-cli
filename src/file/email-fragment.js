const {
  CATEGORY_TYPES,
} = require('veeva-approved-email-util/lib/tokens/category')

const { FILE_TYPES } = require('../util/cli')
const {
  flagDuplicateTokens,
  flagUnsupportedTokenCategories,
  flagUnsupportedTokens,
} = require('../util/flag')

const UNIQUE_TOKENS = [
  '{{FootnoteStart}}',
  '{{FootnoteEnd}}',
  '{{CitationStart}}',
  '{{CitationEnd}}',
]
const SUPPORTED_TOKEN_CATEGORIES = [
  CATEGORY_TYPES.CONTENT,
  CATEGORY_TYPES.CITATION,
  CATEGORY_TYPES.FOOTNOTE,
  CATEGORY_TYPES.FUNCTIONALITY,
  CATEGORY_TYPES.VAULT,
  CATEGORY_TYPES.UNSUBSCRIBE,
]
const UNSUPPORTED_TOKENS = [
  '{{EventSession',
  '{{EventSpeaker',
  '{{requiresReview',
  '{{insertEngageAndZoomJoinURL',
  '{{insertZoomDialInNumbers',
]
const fileType = FILE_TYPES.ef

/**
 * Lints Veeva tokens found in email fragment files.
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

  flagDuplicateTokens({
    fileType,
    veevaTokens,
    uniqueTokensList: UNIQUE_TOKENS,
    logArray: logs,
  })

  return logs
}

module.exports = {
  lint,
}
