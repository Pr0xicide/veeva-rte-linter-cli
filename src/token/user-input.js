const { GRADE, createLogMessage } = require('../util/logging')

const REGEX_DROPDOWN = /\{\{customText\[(.*?)\]\}\}/g
const standardTokens = [
  '{{customText}}',
  '{{customText:Required}}',
  '{{customRichText}}',
]

const validate = (veevaToken) => {}

module.exports = {
  validate,
}
