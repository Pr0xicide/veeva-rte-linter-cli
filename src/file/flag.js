const {
  getTokenCategorySummary,
  CATEGORY_TYPES,
} = require('veeva-approved-email-util/lib/tokens/category')
const { GRADE } = require('veeva-approved-email-util/lib/linting/grading')
const {
  DuplicateTokenCategoryMessage,
  DuplicateTokenMessage,
  InvalidTokenMessage,
  UnknownTokenMessage,
} = require('../util/message')
const { FILE_TYPES } = require('../util/cli')
const { isCategorySupported, isTokenSupported } = require('./contains')

/**
 * Flag any duplicate token categories found in the HTML source code that should be used once.
 *
 * @param {{fileType: FILE_TYPES, veevaTokens: Array<>, uniqueTokenCategoryList: Array<>, logArray: Array<>}} params
 * @returns {void}
 */
const flagDuplicateCategories = (params) => {
  const { fileType, veevaTokens, uniqueTokenCategoryList, logArray } = params
  const categorySummary = getTokenCategorySummary(veevaTokens)

  // Loop through each category and flag any duplicate categories.
  for (let i = 0; i < uniqueTokenCategoryList.length; i++) {
    // Correct number of tokens per category, exit.
    if (categorySummary[uniqueTokenCategoryList[i]] < 2) break

    // List of duplicate tokens found in the file.
    const duplicateCategoryList = veevaTokens.filter(
      (veevaToken) => veevaToken.category === uniqueTokenCategoryList[i]
    )

    duplicateCategoryList.forEach((duplicateToken) => {
      duplicateToken.isTokenDuplicated = true
    })

    // Generate new error msg.
    const errorMsg = new DuplicateTokenCategoryMessage({
      fileType,
      category: uniqueTokenCategoryList[i],
      duplicateCategories: duplicateCategoryList,
    })

    // Log message.
    logArray.push(errorMsg)
  }
}

/**
 * Flag any duplicate tokens (not to be confused with token category) found in the HTML source code that should be used once.
 *
 * @param {{fileType: FILE_TYPES, veevaTokens: Array<>, uniqueTokensList: Array<>, logArray: Array<>}} params
 * @returns {void}
 */
const flagDuplicateTokens = (params) => {
  const { fileType, veevaTokens, uniqueTokensList, logArray } = params

  // Filter out Veeva tokens matching with tokens in the unique token list.
  const uniqueTokens = veevaTokens.filter((veevaToken) => {
    const { token } = veevaToken
    if (uniqueTokensList.indexOf(token) >= 0) return token
  })

  // If no unique tokens are in list of array of provided Veeva tokens.
  if (uniqueTokens.length === 0) return

  // Report of how many times each Veeva token is being duplicated.
  const duplicateTokenReport = uniqueTokens.reduce((acc, obj) => {
    const token = obj.token
    acc[token] = (acc[token] || 0) + 1
    return acc
  }, {})

  for (let i = 0; i < uniqueTokensList.length; i++) {
    // No unique tokens found in the list of tokens provided, exit.
    if (!duplicateTokenReport[uniqueTokensList[i]]) break

    const count = duplicateTokenReport[uniqueTokensList[i]]

    // Token is not duplicated in the source code, exit.
    if (count < 2) break

    // Generate new error message.
    const errorMsg = new DuplicateTokenMessage({
      fileType,
      token: uniqueTokensList[i],
      duplicateTokens: uniqueTokens.filter(
        (uniqueToken) => uniqueToken.token === uniqueTokensList[i]
      ),
    })

    logArray.push(errorMsg)
  }
}

/**
 * Flag if there are any invalid tokens in an approved email file type.
 *
 * @param {{fileType: FILE_TYPES, veevaTokens: Array<>, uniqueTokenCategoryList: Array<>, logArray: Array<>}} params
 * @returns {void}
 */
const flagUnsupportedTokenCategories = (params) => {
  const { fileType, veevaTokens, supportedCategories, logArray } = params

  for (let i = 0; i < veevaTokens.length; i++) {
    const { category, token, line } = veevaTokens[i]
    veevaTokens[i].isCategorySupported = true

    // Ignore unknown/unidentified tokens, as those will be flagged elsewhere.
    if (category === CATEGORY_TYPES.UNKNOWN) break
    else if (!isCategorySupported(category, supportedCategories)) {
      veevaTokens[i].isCategorySupported = false
      logArray.push(
        new InvalidTokenMessage({
          grade: GRADE.ERROR,
          line,
          token,
          message: `Veeva ${category} tokens are not supported in ${fileType}s`,
        })
      )
    }
  }
}

/**
 * Flag if there are any unsupported tokens in an approved email file type.
 *
 * @param {{fileType: FILE_TYPES, veevaTokens: Array<>, invalidTokensList: Array<>, logArray: Array<>}} params
 * @returns {void}
 */
const flagUnsupportedTokens = (params) => {
  const { fileType, veevaTokens, unsupportedTokens, logArray } = params

  for (let i = 0; i < veevaTokens.length; i++) {
    const { token, line } = veevaTokens[i]
    veevaTokens[i].isTokenSupported = true

    // Veeva token is not supported in template fragments.
    if (!isTokenSupported(token, unsupportedTokens)) {
      veevaTokens[i].isTokenSupported = false
      logArray.push(
        new InvalidTokenMessage({
          grade: GRADE.ERROR,
          line,
          token,
          message: `Token "${token}" is not supported in ${fileType} file types`,
        })
      )
    }
  }
}

module.exports = {
  flagDuplicateCategories,
  flagDuplicateTokens,
  flagUnsupportedTokenCategories,
  flagUnsupportedTokens,
  // flagVeevaTokens,
}
