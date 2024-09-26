const {
  CATEGORY_TYPES,
} = require('veeva-approved-email-util/lib/tokens/category')

const { FILE_TYPES } = require('../util/cli')
const {
  flagUnsupportedTokenCategories,
  flagDuplicateTokens,
  flagDuplicateCategories,
  flagUnsupportedTokens,
} = require('./flag')

const SUPPORTED_TOKEN_CATEGORIES = [
  CATEGORY_TYPES.CONTENT,
  CATEGORY_TYPES.CONSENT,
  CATEGORY_TYPES.CITATION,
  CATEGORY_TYPES.FOOTNOTE,
  CATEGORY_TYPES.FUNCTIONALITY,
  CATEGORY_TYPES.USER_INPUT,
  CATEGORY_TYPES.EMAIL_FRAGMENT,
  CATEGORY_TYPES.TEMPLATE_FRAGMENT,
  CATEGORY_TYPES.SIGNATURE,
  CATEGORY_TYPES.UNSUBSCRIBE,
  CATEGORY_TYPES.VAULT,
]
const UNIQUE_TOKEN_CATEGORIES = [
  CATEGORY_TYPES.EMAIL_FRAGMENT,
  CATEGORY_TYPES.TEMPLATE_FRAGMENT,
]
const UNIQUE_TOKENS = [
  '{{InsertFootnotes}}',
  '{{InsertCitations}}',
  '{{InsertCitationSummaries}}',
]
const UNSUPPORTED_TOKENS = [
  '{{FootnoteSymbol',
  '{{CitationNumber',
  '{{CitationSummaryStart}}',
  '{{CitationSummaryEnd}}',
]

const fileType = FILE_TYPES.et

/**
 * Lints Veeva tokens found in email template files.
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

  flagDuplicateCategories({
    fileType,
    veevaTokens,
    uniqueTokenCategoryList: UNIQUE_TOKEN_CATEGORIES,
    logArray: logs,
  })

  flagDuplicateTokens({
    fileType,
    veevaTokens,
    uniqueTokensList: UNIQUE_TOKENS,
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
