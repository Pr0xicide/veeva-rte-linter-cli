const { GRADE } = require('veeva-approved-email-util/lib/linting/grading')
const {
  CATEGORY_TYPES,
} = require('veeva-approved-email-util/lib/tokens/category')
const { FILE_TYPES } = require('../util/cli')

const { lint: lintEmailTemplate } = require('./email-template')
const { lint: lintEmailFragment } = require('./email-fragment')
const { lint: lintTemplateFragment } = require('./template-fragment')

const VEEVA_FILE_LINTERS = Object.freeze({
  'email template': lintEmailTemplate,
  'email fragment': lintEmailFragment,
  'template fragment': lintTemplateFragment,
})

/**
 * Lints the Veeva tokens based on the file type.
 *
 * @param {FILE_TYPES} fileType HTML file type to lint
 * @param {Array<{line:number, category:CATEGORY_TYPES, token:String}>} veevaTokens array tokens to lint
 * @returns {Array<{line:number, grade:GRADE, token:String, message:String}>} array of objects containing info about each token
 */
const lintSourceFile = (fileType, veevaTokens) => {
  const logs = VEEVA_FILE_LINTERS[fileType](veevaTokens)
  return logs
}

module.exports = {
  lintSourceFile,
}
