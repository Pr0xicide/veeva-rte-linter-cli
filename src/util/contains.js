const {
  CATEGORY_TYPES,
} = require('veeva-approved-email-util/lib/tokens/category')

/**
 * Determine if the token category is supported in the file type.
 *
 * @param {CATEGORY_TYPES} category Veeva token category determine by determineTokenCategory
 * @param {Array<CATEGORY_TYPES>} validCategoriesList list of categories allowed in the file type
 * @returns {boolean} boolean value if category isn't allowed in the file type
 */
const isCategorySupported = (category, validCategoriesList) => {
  return validCategoriesList.includes(category)
}

/**
 * Determine if the token provided is supported in the file type.
 *
 * @param {String} token Veeva token to lint
 * @param {Array<String>} invalidTokenList array of Veeva tokens to match
 * @returns {boolean} boolean value if token isn't supported in the file type
 */
const isTokenSupported = (token, invalidTokenList) => {
  let valid = true

  for (let i = 0; i < invalidTokenList.length; i++) {
    if (token.indexOf(invalidTokenList[i]) >= 0) {
      valid = false
      break
    }
  }

  return valid
}

module.exports = {
  isCategorySupported,
  isTokenSupported,
}
